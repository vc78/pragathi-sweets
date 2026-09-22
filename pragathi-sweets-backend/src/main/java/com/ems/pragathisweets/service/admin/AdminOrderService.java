package com.ems.pragathisweets.service.admin;

import com.ems.pragathisweets.dto.OrderResponse;
import com.ems.pragathisweets.dto.admin.OrderStatusRequest;
import com.ems.pragathisweets.entity.Order;
import com.ems.pragathisweets.entity.OrderStatus;
import com.ems.pragathisweets.entity.PaymentMethod;
import com.ems.pragathisweets.entity.PaymentStatus;
import com.ems.pragathisweets.exception.ResourceNotFoundException;
import com.ems.pragathisweets.repository.OrderRepository;
import com.ems.pragathisweets.service.EmailService;
import com.ems.pragathisweets.service.OrderService;
import com.ems.pragathisweets.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final EmailService emailService;
    private final WhatsAppService whatsAppService;

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(orderService::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable).map(orderService::toResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(Long id) {
        Order order = findEntity(id);
        return orderService.toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusRequest request) {
        Order order = findEntity(id);

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid order status: " + request.getStatus());
        }

        order.setStatus(newStatus);

        // ── COD Auto-Settlement ──────────────────────────────────────────────
        // When an admin marks a COD order as DELIVERED, cash has been collected
        // at the doorstep. Automatically update paymentStatus to COLLECTED so
        // the customer's order history reflects real payment state.
        if (newStatus == OrderStatus.DELIVERED
                && order.getPaymentMethod() == PaymentMethod.COD
                && order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.COLLECTED);
            emailService.sendCodPaymentCollectedEmail(
                    order.getUser().getEmail(),
                    order.getOrderNumber(),
                    order.getFinalAmount().toString());
        }

        Order saved = orderRepository.save(order);

        emailService.sendOrderStatusUpdateEmail(order.getUser().getEmail(), order.getOrderNumber(), newStatus.name());

        // WhatsApp status update for every status transition
        String phone = order.getContactPhone() != null ? order.getContactPhone() : order.getUser().getPhone();
        whatsAppService.sendOrderStatusUpdate(
                order.getOrderNumber(), newStatus.name(), order.getUser().getFullName(), phone);

        return orderService.toResponse(saved);
    }

    private Order findEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
