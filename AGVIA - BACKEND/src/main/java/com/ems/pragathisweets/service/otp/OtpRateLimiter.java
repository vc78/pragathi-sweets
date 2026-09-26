package com.ems.pragathisweets.service.otp;

import com.ems.pragathisweets.exception.RateLimitExceededException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpRateLimiter {

    @Value("${otp.max-requests-per-phone-per-hour:5}")
    private int maxRequestsPerPhonePerHour;

    @Value("${otp.max-requests-per-ip-per-hour:10}")
    private int maxRequestsPerIpPerHour;

    @Value("${otp.resend-cooldown-seconds:60}")
    private int resendCooldownSeconds;

    private static final long ONE_HOUR_MILLIS = 3600_000L;

    private final Map<String, LinkedList<Long>> phoneTimestamps = new ConcurrentHashMap<>();
    private final Map<String, LinkedList<Long>> ipTimestamps = new ConcurrentHashMap<>();

    public synchronized void checkAndRecordPhone(String phoneNumber) {
        long now = System.currentTimeMillis();
        LinkedList<Long> list = phoneTimestamps.computeIfAbsent(phoneNumber, k -> new LinkedList<>());
        prune(list, now, ONE_HOUR_MILLIS);

        if (list.size() >= maxRequestsPerPhonePerHour) {
            throw new RateLimitExceededException("Too many OTP requests for this phone number. Please try again later.");
        }
        list.addLast(now);
    }

    public synchronized void checkAndRecordIp(String ip) {
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            return;
        }
        long now = System.currentTimeMillis();
        LinkedList<Long> list = ipTimestamps.computeIfAbsent(ip, k -> new LinkedList<>());
        prune(list, now, ONE_HOUR_MILLIS);

        if (list.size() >= maxRequestsPerIpPerHour) {
            throw new RateLimitExceededException("Too many OTP requests from your network. Please try again later.");
        }
        list.addLast(now);
    }

    public int getResendCooldownSeconds() {
        return resendCooldownSeconds;
    }

    private void prune(LinkedList<Long> list, long now, long window) {
        long cutoff = now - window;
        Iterator<Long> it = list.iterator();
        while (it.hasNext()) {
            if (it.next() < cutoff) {
                it.remove();
            } else {
                break;
            }
        }
    }
}
