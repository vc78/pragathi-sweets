package com.ems.pragathisweets.config;

import com.ems.pragathisweets.entity.Role;
import com.ems.pragathisweets.entity.User;
import com.ems.pragathisweets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures admin account and AGVIA luxury fashion boutique catalog exist on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final com.ems.pragathisweets.repository.CategoryRepository categoryRepository;
    private final com.ems.pragathisweets.repository.ProductRepository productRepository;
    private final com.ems.pragathisweets.repository.CouponRepository couponRepository;
    private final com.ems.pragathisweets.repository.SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name}")
    private String defaultAdminName;

    @Override
    public void run(String... args) {
        boolean adminExists = userRepository.findByEmail(defaultAdminEmail).isPresent();
        if (!adminExists) {
            User admin = User.builder()
                    .fullName(defaultAdminName)
                    .email(defaultAdminEmail)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin account created with email: {}", defaultAdminEmail);
            log.warn("Change the default admin password immediately in production!");
        }

        seedDefaultCategoriesAndProducts();
        seedDefaultCoupons();
        seedDefaultSubscriptions();
    }

    private void seedDefaultCategoriesAndProducts() {
        var sarees = getOrCreateCategory("Sarees", "Heirloom Kanjeevaram, Banarasi, and tissue silks woven with certified gold zari.", "/images/pexels-gaurav-kumar-1281378-18488298.jpg");
        var lehengas = getOrCreateCategory("Lehengas", "Regal bridal trousseau lehengas adorned with hand-stitched zardozi and gota patti.", "/images/pexels-shanks-emperor-1524379304-28769884.jpg");
        var anarkalis = getOrCreateCategory("Anarkalis & Kurtas", "Flowing multi-kalidar anarkalis, raw silk kurtas, and handcrafted organza dupattas.", "/images/pexels-divigraphy-8624624.jpg");
        var dresses = getOrCreateCategory("Dresses & Gowns", "Sculpted cocktail gowns, corset drape dresses, and modern Indo-western silhouettes.", "/images/pexels-divigraphy-14467844.jpg");
        var weddingEdit = getOrCreateCategory("Wedding & Festive Edit", "Curated royal collections for Mehendi, Sangeet, Haldi, and grand reception galas.", "/images/pexels-jonathanborba-19863265.jpg");

        log.info("Seeding AGVIA luxury women's wear boutique catalogue...");

        // Sarees
        seedProductIfAbsent("Kanjeevaram Gold Zari Saree", "Silk Mark certified pure mulberry silk woven on traditional pit looms with certified gold electroplated zari.", "AGV-SR-01", "18500.00", 35, "piece", "/images/pexels-gaurav-kumar-1281378-18488298.jpg", sarees, true, 4.9, 48);
        seedProductIfAbsent("Banarasi Katan Silk Saree", "Handcrafted floral jaal weave with regal kadwa technique, rich pallu, and unstitched blouse piece.", "AGV-SR-02", "14200.00", 30, "piece", "/images/pexels-gaurav-kumar-1281378-18488310.jpg", sarees, true, 4.8, 36);
        seedProductIfAbsent("Chanderi Tissue Zari Saree", "Ethereal shimmering metallic gold tissue drape adorned with delicate scalloped resham borders.", "AGV-SR-03", "11900.00", 25, "piece", "/images/pexels-gaurav-kumar-1281378-18488298.jpg", sarees, false, 4.7, 24);

        // Lehengas
        seedProductIfAbsent("Heritage Crimson Bridal Lehenga", "Hand-embroidered zardozi, dabka, and velvet patchwork needlework on pure mulberry raw silk with double dupatta.", "AGV-LH-01", "45000.00", 15, "set", "/images/pexels-shanks-emperor-1524379304-28769884.jpg", lehengas, true, 5.0, 52);
        seedProductIfAbsent("Emerald Velvet Trousseau Lehenga", "Opulent deep emerald micro-velvet adorned with antique gold gota patti and intricate moti borders.", "AGV-LH-02", "38500.00", 20, "set", "/images/pexels-shanks-emperor-1524379304-28769884.jpg", lehengas, true, 4.9, 41);
        seedProductIfAbsent("Ivory Floral Organza Lehenga", "Hand-painted floral motifs embellished with fine seed pearls, sequins, and lightweight cancan flare.", "AGV-LH-03", "26900.00", 25, "set", "/images/pexels-shanks-emperor-1524379304-28769884.jpg", lehengas, false, 4.8, 29);

        // Anarkalis & Kurtas
        seedProductIfAbsent("Royal Burgundy Kalidar Anarkali", "24-kali flared raw silk silhouette with delicate zardozi neckline and hand-embroidered organza dupatta.", "AGV-AK-01", "12500.00", 40, "set", "/images/pexels-divigraphy-8624624.jpg", anarkalis, true, 4.9, 39);
        seedProductIfAbsent("Handcrafted Chanderi Silk Kurta Set", "Delicate threadwork and gota borders paired with straight-fit silk trousers and matching tissue dupatta.", "AGV-AK-02", "8900.00", 50, "set", "/images/pexels-divigraphy-8624624.jpg", anarkalis, false, 4.8, 31);

        // Dresses & Gowns
        seedProductIfAbsent("Sculpted Emerald Mermaid Gown", "Structured internal canvas corsetry with elegant floor-length draping for soirée galas and receptions.", "AGV-DG-01", "16800.00", 20, "piece", "/images/pexels-divigraphy-14467844.jpg", dresses, true, 4.9, 35);
        seedProductIfAbsent("Rose Gold Metallic Drape Gown", "Contemporary Indo-western fusion with pre-pleated drape and subtle crystal beadwork.", "AGV-DG-02", "19500.00", 18, "piece", "/images/pexels-divigraphy-14467844.jpg", dresses, false, 4.7, 22);

        // Wedding & Festive Edit
        seedProductIfAbsent("Mehendi Mustard Silk Ensemble", "Festive sunshine yellow raw silk with mirrorwork embroidery, ideal for Haldi and Mehendi rituals.", "AGV-WF-01", "15400.00", 25, "set", "/images/pexels-jonathanborba-19863265.jpg", weddingEdit, true, 4.8, 44);
        seedProductIfAbsent("Royal Trousseau Keepsake Trunk Edit", "Curated festive trousseau set with pure silk saree, bespoke embroidered pouch, and keepsake box.", "AGV-WF-02", "28900.00", 15, "box", "/images/pexels-jonathanborba-19863265.jpg", weddingEdit, true, 5.0, 58);
    }

    private void seedDefaultCoupons() {
        if (couponRepository.count() == 0) {
            log.info("Seeding initial AGVIA boutique promotional coupons...");
            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("AGVIA15")
                    .description("Atelier Launch — 15% discount across boutique couture")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("15.00"))
                    .minOrderAmount(new java.math.BigDecimal("2000.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("5000.00"))
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(6))
                    .usageLimit(1000)
                    .usedCount(0)
                    .active(true)
                    .build());

            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("BRIDAL500")
                    .description("Bridal Special — Flat ₹500 off on couture bridal trousseaus")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.FLAT)
                    .discountValue(new java.math.BigDecimal("500.00"))
                    .minOrderAmount(new java.math.BigDecimal("10000.00"))
                    .maxDiscountAmount(null)
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(6))
                    .usageLimit(500)
                    .usedCount(0)
                    .active(true)
                    .build());

            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("COUTURE10")
                    .description("Welcome Gift — 10% off for new atelier patrons")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("10.00"))
                    .minOrderAmount(new java.math.BigDecimal("1500.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("2000.00"))
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(12))
                    .usageLimit(2000)
                    .usedCount(0)
                    .active(true)
                    .build());
            log.info("Boutique coupons seeded successfully (AGVIA15, BRIDAL500, COUTURE10).");
        }

        if (couponRepository.findByCodeIgnoreCase("CIRCLE15").isEmpty()) {
            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("CIRCLE15")
                    .description("AGVIA Atelier Circle VIP Member Exclusive — 15% off couture")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("15.00"))
                    .minOrderAmount(new java.math.BigDecimal("1000.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("10000.00"))
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(12))
                    .usageLimit(5000)
                    .usedCount(0)
                    .active(true)
                    .build());
            log.info("VIP Circle coupon CIRCLE15 seeded successfully.");
        }
    }

    private com.ems.pragathisweets.entity.Category getOrCreateCategory(String name, String description, String imageUrl) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                        .name(name)
                        .description(description)
                        .imageUrl(imageUrl)
                        .active(true)
                        .build()));
    }

    private void seedProductIfAbsent(String name, String description, String sku, String price, int stock, String unit, String image, com.ems.pragathisweets.entity.Category category, boolean bestseller, double rating, int reviews) {
        if (!productRepository.existsBySkuIgnoreCase(sku)) {
            productRepository.save(com.ems.pragathisweets.entity.Product.builder()
                    .name(name)
                    .description(description)
                    .sku(sku)
                    .price(new java.math.BigDecimal(price))
                    .stockQuantity(stock)
                    .unit(unit)
                    .imageUrl(image)
                    .category(category)
                    .bestseller(bestseller)
                    .avgRating(rating)
                    .numReviews(reviews)
                    .active(true)
                    .build());
        }
    }

    private void seedDefaultSubscriptions() {
        if (subscriptionRepository.count() == 0) {
            subscriptionRepository.save(com.ems.pragathisweets.entity.Subscription.builder()
                    .email("venkatchowdary9177@gmail.com")
                    .customerName("Venkat Chowdary")
                    .customerPhone("+91 98765 43210")
                    .planName("PRAGATHI_CIRCLE_VIP")
                    .planTier("VIP")
                    .amount(new java.math.BigDecimal("499.00"))
                    .status(com.ems.pragathisweets.entity.SubscriptionStatus.ACTIVE)
                    .paymentMethod(com.ems.pragathisweets.entity.PaymentMethod.RAZORPAY)
                    .paymentStatus(com.ems.pragathisweets.entity.PaymentStatus.SUCCESS)
                    .paymentId("pay_rzp_mock_vip1")
                    .exclusiveCoupon("CIRCLE15")
                    .discountPercent(15)
                    .startDate(java.time.LocalDateTime.now().minusDays(1))
                    .validTill(java.time.LocalDateTime.now().plusDays(364))
                    .autoRenew(true)
                    .notes("AGVIA Atelier Circle VIP Member")
                    .build());

            subscriptionRepository.save(com.ems.pragathisweets.entity.Subscription.builder()
                    .email("ananya.rao@example.com")
                    .customerName("Ananya Rao")
                    .customerPhone("+91 98123 45678")
                    .planName("PRAGATHI_CIRCLE_VIP")
                    .planTier("VIP")
                    .amount(new java.math.BigDecimal("499.00"))
                    .status(com.ems.pragathisweets.entity.SubscriptionStatus.ACTIVE)
                    .paymentMethod(com.ems.pragathisweets.entity.PaymentMethod.RAZORPAY)
                    .paymentStatus(com.ems.pragathisweets.entity.PaymentStatus.SUCCESS)
                    .paymentId("pay_rzp_mock_vip2")
                    .exclusiveCoupon("CIRCLE15")
                    .discountPercent(15)
                    .startDate(java.time.LocalDateTime.now().minusDays(5))
                    .validTill(java.time.LocalDateTime.now().plusDays(360))
                    .autoRenew(true)
                    .notes("AGVIA Bridal Trousseau subscriber")
                    .build());

            log.info("Default VIP subscriptions seeded successfully.");
        }
    }
}
