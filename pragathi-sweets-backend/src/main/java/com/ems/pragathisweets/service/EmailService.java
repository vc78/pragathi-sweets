package com.ems.pragathisweets.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails. Email dispatch is guarded by app.mail.enabled
 * so the application can run without valid SMTP credentials in dev/test.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.enabled}")
    private boolean mailEnabled;

    @Async
    public void sendWelcomeEmail(String to, String fullName) {
        String subject = "Welcome to Pragathi Sweets!";
        String body = "Hi " + fullName + ",\n\n" +
                "Thank you for registering with Pragathi Sweets. Explore our range of authentic sweets and snacks!\n\n" +
                "Warm regards,\nPragathi Sweets Team";
        send(to, subject, body);
    }

    @Async
    public void sendOrderConfirmationEmail(String to, String orderNumber, String amount) {
        String subject = "Order Confirmation - " + orderNumber;
        String body = "Your order " + orderNumber + " for Rs. " + amount + " has been placed successfully.\n\n" +
                "We will notify you once it is shipped.\n\nThank you for shopping with Pragathi Sweets!";
        send(to, subject, body);
    }

    @Async
    public void sendOrderStatusUpdateEmail(String to, String orderNumber, String status) {
        String subject = "Order Update - " + orderNumber;
        String body = "Your order " + orderNumber + " status has been updated to: " + status + ".\n\n" +
                "Thank you for shopping with Pragathi Sweets!";
        send(to, subject, body);
    }

    /**
     * Sent when a COD order is delivered and cash payment is confirmed collected
     * by the delivery agent. Serves as the customer's payment receipt for COD.
     */
    @Async
    public void sendCodPaymentCollectedEmail(String to, String orderNumber, String amount) {
        String subject = "Payment Received — Order " + orderNumber;
        String body = "Hi,\n\n" +
                "Your Cash on Delivery payment of ₹" + amount + " for order " + orderNumber +
                " has been successfully collected by our delivery partner.\n\n" +
                "Your order is now complete. Thank you for choosing Pragathi Sweets!\n\n" +
                "Warm regards,\nPragathi Sweets Team";
        send(to, subject, body);
    }

    private void send(String to, String subject, String body) {
        if (!mailEnabled) {
            log.info("Mail disabled (app.mail.enabled=false). Skipping email to {} - subject: {}", to, subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
