package com.ems.pragathisweets.util;

import java.util.regex.Pattern;

public final class PhoneUtils {

    private static final Pattern E164_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");
    private static final Pattern INDIAN_PHONE_PATTERN = Pattern.compile("^\\+91[6-9]\\d{9}$");

    private PhoneUtils() {}

    /**
     * Normalizes a phone number to standard E.164 format.
     * Special handling for 10-digit Indian numbers: prepends +91.
     */
    public static String normalize(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            throw new IllegalArgumentException("Phone number cannot be blank.");
        }

        String cleaned = rawPhone.trim().replaceAll("[\\s\\-\\(\\)]", "");

        if (cleaned.startsWith("+")) {
            String digits = cleaned.substring(1).replaceAll("[^0-9]", "");
            String result = "+" + digits;
            validateFormat(result);
            return result;
        }

        String digitsOnly = cleaned.replaceAll("[^0-9]", "");

        // 11 digits starting with 0 (e.g. 09876543210)
        if (digitsOnly.length() == 11 && digitsOnly.startsWith("0")) {
            digitsOnly = digitsOnly.substring(1);
        }

        // 10 digits (Standard Indian mobile)
        if (digitsOnly.length() == 10) {
            String result = "+91" + digitsOnly;
            validateFormat(result);
            return result;
        }

        // 12 digits starting with 91
        if (digitsOnly.length() == 12 && digitsOnly.startsWith("91")) {
            String result = "+" + digitsOnly;
            validateFormat(result);
            return result;
        }

        String result = "+" + digitsOnly;
        validateFormat(result);
        return result;
    }

    private static void validateFormat(String e164Phone) {
        if (!E164_PATTERN.matcher(e164Phone).matches()) {
            throw new IllegalArgumentException("Invalid phone number format. Must be a valid mobile number.");
        }
        if (e164Phone.startsWith("+91") && !INDIAN_PHONE_PATTERN.matcher(e164Phone).matches()) {
            throw new IllegalArgumentException("Invalid Indian mobile number. Must be 10 digits starting with 6, 7, 8, or 9.");
        }
    }

    /**
     * Masks phone number for secure client display (e.g. "+91 ******3210").
     */
    /**
     * Masks phone number for secure client display (e.g. "90******61").
     * Defaults to 91 country code without representing "+91" in the UI.
     */
    public static String mask(String phone) {
        if (phone == null || phone.isBlank()) {
            return "******";
        }
        String clean = phone.trim().replaceAll("[^0-9]", "");
        if (clean.length() == 12 && clean.startsWith("91")) {
            clean = clean.substring(2);
        }
        if (clean.length() >= 10) {
            String first2 = clean.substring(0, 2);
            String last2 = clean.substring(clean.length() - 2);
            return first2 + "******" + last2;
        }
        if (clean.length() >= 4) {
            return "******" + clean.substring(clean.length() - 4);
        }
        return "******";
    }
}
