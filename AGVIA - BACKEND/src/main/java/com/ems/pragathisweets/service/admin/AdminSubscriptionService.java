package com.ems.pragathisweets.service.admin;

import com.ems.pragathisweets.dto.GrantSubscriptionRequest;
import com.ems.pragathisweets.dto.SubscriptionResponse;
import com.ems.pragathisweets.dto.SubscriptionStatsResponse;
import com.ems.pragathisweets.entity.PaymentMethod;
import com.ems.pragathisweets.entity.PaymentStatus;
import com.ems.pragathisweets.entity.Subscription;
import com.ems.pragathisweets.entity.SubscriptionStatus;
import com.ems.pragathisweets.entity.User;
import com.ems.pragathisweets.exception.ResourceNotFoundException;
import com.ems.pragathisweets.repository.SubscriptionRepository;
import com.ems.pragathisweets.repository.UserRepository;
import com.ems.pragathisweets.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminSubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<SubscriptionResponse> getAll(SubscriptionStatus status, String query, Pageable pageable) {
        return subscriptionRepository.searchSubscriptions(status, query, pageable)
                .map(subscriptionService::toResponse);
    }

    @Transactional(readOnly = true)
    public SubscriptionStatsResponse getStats() {
        long total = subscriptionRepository.count();
        long active = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long pending = subscriptionRepository.countByStatus(SubscriptionStatus.PENDING_PAYMENT);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endOfMonth = now.plusDays(30);
        long expiringThisMonth = subscriptionRepository.countExpiringBetween(now, endOfMonth);

        BigDecimal revenue = subscriptionRepository.sumSubscriptionRevenue();

        return SubscriptionStatsResponse.builder()
                .totalSubscribers(total)
                .activeSubscribers(active)
                .pendingSubscribers(pending)
                .expiringThisMonth(expiringThisMonth)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .build();
    }

    @Transactional
    public SubscriptionResponse updateStatus(Long id, String statusStr) {
        Subscription subscription = findEntity(id);
        SubscriptionStatus newStatus = SubscriptionStatus.valueOf(statusStr.toUpperCase());
        subscription.setStatus(newStatus);
        if (newStatus == SubscriptionStatus.ACTIVE) {
            subscription.setPaymentStatus(PaymentStatus.SUCCESS);
            if (subscription.getValidTill() == null || subscription.getValidTill().isBefore(LocalDateTime.now())) {
                subscription.setValidTill(LocalDateTime.now().plusDays(365));
            }
        }
        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionService.toResponse(saved);
    }

    @Transactional
    public SubscriptionResponse extendValidity(Long id, int days) {
        Subscription subscription = findEntity(id);
        LocalDateTime base = subscription.getValidTill();
        if (base == null || base.isBefore(LocalDateTime.now())) {
            base = LocalDateTime.now();
        }
        subscription.setValidTill(base.plusDays(days));
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionService.toResponse(saved);
    }

    @Transactional
    public SubscriptionResponse grantSubscription(GrantSubscriptionRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        Subscription sub = subscriptionRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElse(Subscription.builder()
                        .email(email)
                        .planName(request.getPlanName() != null ? request.getPlanName() : "PRAGATHI_CIRCLE_VIP")
                        .planTier(request.getPlanTier() != null ? request.getPlanTier() : "VIP")
                        .build());

        sub.setUser(user);
        sub.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : (user != null ? user.getFullName() : email.split("@")[0]));
        sub.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : (user != null ? user.getPhone() : null));
        sub.setAmount(request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO);
        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setPaymentMethod(PaymentMethod.COD);
        sub.setPaymentStatus(PaymentStatus.COLLECTED);
        sub.setPaymentId("GRANT_ADMIN_" + System.currentTimeMillis());
        sub.setStartDate(LocalDateTime.now());
        
        int days = (request.getDurationDays() != null && request.getDurationDays() > 0) ? request.getDurationDays() : 365;
        sub.setValidTill(LocalDateTime.now().plusDays(days));
        sub.setNotes(request.getNotes() != null ? request.getNotes() : "Complimentary membership granted by Administrator");

        Subscription saved = subscriptionRepository.save(sub);
        return subscriptionService.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Subscription subscription = findEntity(id);
        subscriptionRepository.delete(subscription);
    }

    private Subscription findEntity(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
    }
}
