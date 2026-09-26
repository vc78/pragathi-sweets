package com.ems.pragathisweets.entity;

public enum PaymentStatus {
    PENDING,
    CREATED,
    SUCCESS,
    COLLECTED,   // COD — cash received at doorstep on delivery
    FAILED,
    REFUNDED
}
