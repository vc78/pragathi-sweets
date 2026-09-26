package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.OrderNotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderNotificationLogRepository extends JpaRepository<OrderNotificationLog, Long> {

    boolean existsByOrderIdAndEventTypeAndRecipientAndStatus(Long orderId, String eventType, String recipient, String status);

    Optional<OrderNotificationLog> findFirstByOrderIdAndEventTypeAndRecipient(Long orderId, String eventType, String recipient);

    List<OrderNotificationLog> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    List<OrderNotificationLog> findByStatusAndAttemptCountLessThan(String status, int maxAttempts);
}
