package com.ems.pragathisweets.service;

import com.ems.pragathisweets.dto.OrderItemResponse;
import com.ems.pragathisweets.dto.OrderResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

/**
 * WhatsApp notification service powered by Twilio's WhatsApp Business API.
 *
 * <p>Messages are sent asynchronously so the order placement flow is never blocked.
 * The service is disabled by default ({@code app.whatsapp.enabled=false}) so the
 * application runs normally in dev/CI environments without valid Twilio credentials.
 *
 * <h2>Setup (one-time, free sandbox)</h2>
 * <ol>
 *   <li>Create a free Twilio account at <a href="https://www.twilio.com">twilio.com</a></li>
 *   <li>Go to <em>Messaging → Try it out → Send a WhatsApp message</em></li>
 *   <li>Save your <strong>Account SID</strong> and <strong>Auth Token</strong></li>
 *   <li>Set the four properties below in {@code application.properties} or as env-vars</li>
 * </ol>
 */
@Service
@Slf4j
public class WhatsAppService {

    private static final String TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";
    private static final DateTimeFormatter DISPLAY_FMT =
            DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a");

    @Value("${app.whatsapp.enabled:false}")
    private boolean enabled;

    @Value("${app.whatsapp.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.whatsapp.twilio.auth-token:}")
    private String authToken;

    /** Twilio sandbox number e.g. whatsapp:+14155238886 */
    @Value("${app.whatsapp.twilio.from-number:whatsapp:+14155238886}")
    private String fromNumber;

    private final RestTemplate restTemplate = new RestTemplate();

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sends a beautiful, branded order-confirmation WhatsApp message to the
     * customer.  The phone number stored on the contact-phone field of the order
     * is used; if it is absent the user's profile phone is the fallback.
     */
    @Async
    public void sendOrderConfirmation(OrderResponse order, String customerName, String phone) {
        if (!enabled) {
            log.info("[WhatsApp] disabled – skipping order confirmation for order {}", order.getOrderNumber());
            return;
        }
        if (phone == null || phone.isBlank()) {
            log.warn("[WhatsApp] No phone for order {} – skipping", order.getOrderNumber());
            return;
        }

        String message = buildOrderConfirmationMessage(order, customerName);
        send(normalisePhone(phone), message);
    }

    /**
     * Sends an order-status-update WhatsApp notification (e.g., SHIPPED, DELIVERED).
     */
    @Async
    public void sendOrderStatusUpdate(String orderNumber, String status, String customerName, String phone) {
        if (!enabled) {
            log.info("[WhatsApp] disabled – skipping status update for order {}", orderNumber);
            return;
        }
        if (phone == null || phone.isBlank()) return;

        String message = buildStatusUpdateMessage(orderNumber, status, customerName);
        send(normalisePhone(phone), message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Message Templates
    // ─────────────────────────────────────────────────────────────────────────

    public String buildOrderConfirmationMessage(OrderResponse order, String customerName) {
        StringBuilder sb = new StringBuilder();

        sb.append("🎉 *PRAGATHI SWEETS* 🎉\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("✅ *Order Confirmed!*\n\n");

        sb.append("👤 Dear *").append(customerName).append("*,\n");
        sb.append("Your order has been placed successfully!\n\n");

        sb.append("📦 *Order Details*\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("🔖 Order No : *").append(order.getOrderNumber()).append("*\n");
        if (order.getCreatedAt() != null) {
            sb.append("📅 Date      : ").append(order.getCreatedAt().format(DISPLAY_FMT)).append("\n");
        }
        sb.append("💳 Payment   : ").append(formatPaymentMethod(order.getPaymentMethod())).append("\n\n");

        sb.append("🛒 *Items Ordered*\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        List<OrderItemResponse> items = order.getItems();
        if (items != null) {
            for (OrderItemResponse item : items) {
                sb.append("• ").append(item.getProductName())
                  .append(" × ").append(item.getQuantity())
                  .append("  ₹").append(format(item.getSubtotal()))
                  .append("\n");
            }
        }

        sb.append("\n💰 *Price Breakdown*\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("  Sub-total   : ₹").append(format(order.getTotalAmount())).append("\n");

        if (order.getDiscountAmount() != null && order.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            sb.append("  🏷️ Discount  : -₹").append(format(order.getDiscountAmount()));
            if (order.getCouponCode() != null && !order.getCouponCode().isBlank()) {
                sb.append(" (").append(order.getCouponCode()).append(")");
            }
            sb.append("\n");
        }

        BigDecimal delivery = order.getFinalAmount()
                .subtract(order.getTotalAmount())
                .add(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
        if (delivery.compareTo(BigDecimal.ZERO) > 0) {
            sb.append("  🚚 Delivery  : ₹").append(format(delivery)).append("\n");
        } else {
            sb.append("  🚚 Delivery  : *FREE* 🎁\n");
        }

        sb.append("  ─────────────────────\n");
        sb.append("  *TOTAL PAYABLE: ₹").append(format(order.getFinalAmount())).append("*\n\n");

        sb.append("📍 *Deliver To*\n");
        sb.append(order.getShippingAddress()).append("\n\n");

        sb.append("━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("⏰ *Estimated Delivery*: 2–4 Business Days\n\n");
        sb.append("📞 Need help? Call/WhatsApp us anytime.\n");
        sb.append("🌐 pragathisweets.com\n\n");
        sb.append("🙏 *Thank you for choosing Pragathi Sweets!*\n");
        sb.append("_Taste the Tradition_ 🍮");

        return sb.toString();
    }

    public String buildStatusUpdateMessage(String orderNumber, String status, String customerName) {
        String emoji = switch (status.toUpperCase()) {
            case "CONFIRMED"   -> "✅";
            case "PROCESSING"  -> "⚙️";
            case "SHIPPED"     -> "🚚";
            case "DELIVERED"   -> "🎉";
            case "CANCELLED"   -> "❌";
            default            -> "🔔";
        };

        String friendly = switch (status.toUpperCase()) {
            case "CONFIRMED"   -> "Your order has been *Confirmed*!";
            case "PROCESSING"  -> "Your order is being *Prepared* with love 💛";
            case "SHIPPED"     -> "Your order is *Out for Delivery*! 🚚";
            case "DELIVERED"   -> "Your order has been *Delivered*! Enjoy the sweets! 🍮";
            case "CANCELLED"   -> "Your order has been *Cancelled*. Refund (if any) will be processed in 3–5 days.";
            default            -> "Your order status has been updated to *" + status + "*.";
        };

        return "🍮 *PRAGATHI SWEETS*\n" +
               "━━━━━━━━━━━━━━━━━━━━━━\n" +
               emoji + " *Order Update*\n\n" +
               "Hi *" + customerName + "*,\n\n" +
               friendly + "\n\n" +
               "🔖 Order No: *" + orderNumber + "*\n\n" +
               "━━━━━━━━━━━━━━━━━━━━━━\n" +
               "📞 Questions? Reach us anytime.\n" +
               "🙏 Thank you for shopping with Pragathi Sweets!\n" +
               "_Taste the Tradition_ 🍮";
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HTTP Transport (Twilio REST API)
    // ─────────────────────────────────────────────────────────────────────────

    private void send(String toNumber, String message) {
        try {
            String url = TWILIO_API_BASE + "/Accounts/" + accountSid + "/Messages.json";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set(HttpHeaders.AUTHORIZATION, basicAuth(accountSid, authToken));

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", fromNumber);
            body.add("To", "whatsapp:" + toNumber);
            body.add("Body", message);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("[WhatsApp] Message sent to {} for order.", toNumber);
            } else {
                log.error("[WhatsApp] Twilio returned {} for number {}", response.getStatusCode(), toNumber);
            }
        } catch (Exception ex) {
            log.error("[WhatsApp] Failed to send message to {}: {}", toNumber, ex.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private String basicAuth(String user, String password) {
        String credentials = user + ":" + password;
        return "Basic " + Base64.getEncoder()
                .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    /** Normalise Indian phone numbers to E.164 format (+91XXXXXXXXXX). */
    private String normalisePhone(String raw) {
        if (raw == null) return "";
        String digits = raw.replaceAll("[^\\d+]", "");
        // Already in international format
        if (digits.startsWith("+")) return digits;
        // Strip leading 0
        if (digits.startsWith("0")) digits = digits.substring(1);
        // Default to India (+91) if 10 digits provided
        if (digits.length() == 10) return "+91" + digits;
        // Prefix + if no country code indicator
        return "+" + digits;
    }

    private String formatPaymentMethod(String method) {
        if (method == null) return "-";
        return switch (method.toUpperCase()) {
            case "COD"      -> "Cash on Delivery 💵";
            case "RAZORPAY" -> "Online Payment (Razorpay) 💳";
            default         -> method;
        };
    }

    private String format(BigDecimal value) {
        if (value == null) return "0.00";
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}
