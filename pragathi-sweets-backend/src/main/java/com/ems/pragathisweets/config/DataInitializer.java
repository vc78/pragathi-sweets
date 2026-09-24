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
 * Ensures at least one admin account exists on application startup.
 * Configure via app.admin.default-email / app.admin.default-password.
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
        var milkSweets = getOrCreateCategory("Milk Sweets", "Indulgent classics prepared from pure condensed milk solids.", "/images/pexels-divigraphy-8624624.jpg");
        var dryFruitSweets = getOrCreateCategory("Dry Fruit Sweets", "Luxurious confections crafted from organic nuts and silver varq.", "/images/pexels-gaurav-kumar-1281378-18488298.jpg");
        var bengaliSweets = getOrCreateCategory("Bengali Sweets", "Spongy chhena delicacies soaked in light cardamom syrup.", "/images/pexels-gaurav-kumar-1281378-18488316.jpg");
        var savouries = getOrCreateCategory("Savouries", "Crunchy, salted blends prepared in wood-pressed oils.", "/images/pexels-kailashkumarphotography-11887844.jpg");
        var festivalHampers = getOrCreateCategory("Festival Hampers", "Curated premium hampers for festive celebrations.", "/images/pexels-jonathanborba-19863265.jpg");
        var gheeSweets = getOrCreateCategory("Ghee Sweets", "Traditional aromatic sweets enriched with pure A2 Desi cow ghee.", "/images/pexels-divigraphy-14467844.jpg");
        var andhraSweets = getOrCreateCategory("Traditional Andhra Sweets", "Timeless heritage confections from Godavari & Krishna regions.", "/images/pexels-gaurav-kumar-1281378-18488310.jpg");

        log.info("Seeding comprehensive authentic sweets, savouries, and hampers...");

        // Dry Fruit Confections
        seedProductIfAbsent("Royal Kaju Katli", "Thin diamond-cut fudge handcrafted from premium Goan cashews and edible silver leaf.", "PRG-KK-01", "620.00", 100, "kg", "/images/pexels-gaurav-kumar-1281378-18488298.jpg", dryFruitSweets, true, 4.9, 42);
        seedProductIfAbsent("Kaju Pista Roll", "Silky cashew paste rolled over a luscious pistachio and cardamom core.", "PRG-KPR-11", "680.00", 60, "kg", "/images/pexels-gaurav-kumar-1281378-18488298.jpg", dryFruitSweets, true, 4.9, 34);
        seedProductIfAbsent("Anjeer Dry Fruit Barfi", "Naturally sweet dried Turkish figs loaded with almonds, cashews, and zero added sugar.", "PRG-ADF-12", "720.00", 50, "kg", "/images/pexels-mehranb-86649.jpg", dryFruitSweets, false, 4.8, 29);
        seedProductIfAbsent("Badam Katli", "Tender diamond-cut confection made from blanched California almonds and saffron.", "PRG-BK-13", "690.00", 45, "kg", "/images/pexels-gaurav-kumar-1281378-18488298.jpg", dryFruitSweets, false, 4.7, 19);
        seedProductIfAbsent("Dry Fruit Halwa", "Chewy, glistening Karachi-style halwa studded with roasted cashews, pistachios, and melon seeds.", "PRG-DFH-15", "580.00", 55, "kg", "/images/pexels-mehranb-86649.jpg", dryFruitSweets, false, 4.6, 22);

        // Milk Sweets
        seedProductIfAbsent("Pure Ghee Motichoor Ladoo", "Delicate tiny gram flour pearls fried in organic A2 desi ghee and infused with saffron.", "PRG-ML-02", "480.00", 80, "kg", "/images/pexels-divigraphy-8624624.jpg", milkSweets, true, 4.8, 38);
        seedProductIfAbsent("Pista Peda", "Soft milk peda infused with green cardamom and crunchy Iranian pistachios.", "PRG-PP-05", "460.00", 75, "kg", "/images/pexels-divigraphy-8624624.jpg", milkSweets, false, 4.7, 24);
        seedProductIfAbsent("Malai Peda", "Traditional slow-simmered caramelized khoya fudge garnished with saffron.", "PRG-MP-06", "490.00", 65, "kg", "/images/pexels-divigraphy-8624624.jpg", milkSweets, true, 4.8, 31);
        seedProductIfAbsent("Kalakand Supreme", "Grainy, moist cottage cheese sweet slow-cooked in whole milk and cardamom.", "PRG-KK-08", "520.00", 50, "kg", "/images/pexels-divigraphy-14467844.jpg", milkSweets, true, 4.9, 45);
        seedProductIfAbsent("Kesar Peda", "Aromatic Kashmiri saffron-infused milk rounds topped with slivered almonds.", "PRG-KP-10", "480.00", 70, "kg", "/images/pexels-divigraphy-8624624.jpg", milkSweets, false, 4.7, 18);

        // Bengali Sweets
        seedProductIfAbsent("Kolkata Saffron Rasgulla", "Pristine soft chhena spheres bathed in organic saffron-infused sugar elixir.", "PRG-RG-03", "420.00", 65, "box", "/images/pexels-gaurav-kumar-1281378-18488316.jpg", bengaliSweets, false, 4.7, 25);
        seedProductIfAbsent("Angoori Rasmalai", "Bite-sized chhena pearls floating in chilled saffron-pistachio rabri milk.", "PRG-ARM-17", "550.00", 40, "box", "/images/pexels-gaurav-kumar-1281378-18488316.jpg", bengaliSweets, true, 4.9, 52);
        seedProductIfAbsent("Royal Cham Cham", "Oval-shaped cottage cheese delicacy stuffed with mawa and rolled in desiccated coconut.", "PRG-RCC-18", "450.00", 55, "box", "/images/pexels-gaurav-kumar-1281378-18488316.jpg", bengaliSweets, false, 4.6, 20);
        seedProductIfAbsent("Baked Gulab Jamun", "Golden fried milk dumplings simmered in rose cardamom syrup and lightly baked.", "PRG-BGJ-19", "480.00", 70, "box", "/images/pexels-shanks-emperor-1524379304-28769884.jpg", bengaliSweets, true, 4.9, 48);

        // Traditional Andhra Sweets
        seedProductIfAbsent("Special Bellam Pootharekulu", "Traditional paper-thin rice wafers layered with organic jaggery, ghee, and roasted dry fruits.", "PRG-BP-04", "750.00", 40, "box", "/images/pexels-jonathanborba-19863265.jpg", andhraSweets, true, 5.0, 56);
        seedProductIfAbsent("Kakinada Gottam Kaja", "Crispy tube-shaped crust filled with warm, oozing sugar syrup.", "PRG-KGK-22", "420.00", 60, "kg", "/images/pexels-gaurav-kumar-1281378-18488310.jpg", andhraSweets, true, 4.8, 37);
        seedProductIfAbsent("Madugula Halwa", "Heritage wheat milk halwa slow-cooked with pure ghee and dry fruits for 48 hours.", "PRG-MH-23", "650.00", 35, "kg", "/images/pexels-divigraphy-14467844.jpg", andhraSweets, true, 4.9, 41);
        seedProductIfAbsent("Bandar Laddu", "Velvety smooth melt-in-mouth gram flour laddu flavored with nutmeg and mawa.", "PRG-BL-24", "490.00", 70, "kg", "/images/pexels-divigraphy-8624624.jpg", andhraSweets, false, 4.7, 26);
        seedProductIfAbsent("Bellam Gavvalu", "Shell-shaped crispy wheat pastries tossed in viscous organic jaggery syrup.", "PRG-BG-25", "380.00", 80, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", andhraSweets, false, 4.6, 19);
        seedProductIfAbsent("Tapeswaram Madatha Kaja", "Multi-layered ribboned sweet drenched in fragrant cardamom sugar syrup.", "PRG-TMK-28", "440.00", 55, "kg", "/images/pexels-gaurav-kumar-1281378-18488310.jpg", andhraSweets, false, 4.7, 23);

        // Pure Ghee Sweets
        seedProductIfAbsent("Mysore Pak Supreme", "Porous golden besan fudge overflowing with aromatic A2 cow ghee.", "PRG-MPS-29", "540.00", 90, "kg", "/images/pexels-divigraphy-14467844.jpg", gheeSweets, true, 4.9, 58);
        seedProductIfAbsent("Tirupati Besan Ladoo", "Coarse gram flour roasted slowly in desi ghee with cashews, raisins, and edible camphor.", "PRG-TBL-30", "490.00", 85, "kg", "/images/pexels-divigraphy-8624624.jpg", gheeSweets, true, 4.8, 43);
        seedProductIfAbsent("Moong Dal Halwa", "Decadent split yellow moong lentil pudding sautéed in copious quantities of desi ghee.", "PRG-MDH-33", "580.00", 45, "kg", "/images/pexels-divigraphy-14467844.jpg", gheeSweets, false, 4.8, 28);
        seedProductIfAbsent("Gond Ladoo", "Nutritious edible gum laddu packed with winter spices, nuts, and desi ghee.", "PRG-GL-32", "560.00", 40, "kg", "/images/pexels-divigraphy-8624624.jpg", gheeSweets, false, 4.7, 22);

        // Savouries & Namkeens
        seedProductIfAbsent("Andhra Special Mixture", "Spicy, crunchy mixture with boondi, sev, peanuts, roasted gram, and curry leaves.", "PRG-ASM-34", "320.00", 120, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", savouries, true, 4.8, 64);
        seedProductIfAbsent("Chekkalu / Pappu Chekkalu", "Crispy rice flour discs seasoned with chana dal, cumin, ginger, and green chillies.", "PRG-CPC-35", "340.00", 90, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", savouries, true, 4.9, 49);
        seedProductIfAbsent("Ribbon Murukku", "Flat ribbon-like crispy snack made from rice and roasted gram flour seasoned with asafoetida.", "PRG-RM-36", "310.00", 85, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", savouries, false, 4.7, 30);
        seedProductIfAbsent("Kara Boondi", "Crunchy savory chickpea pearls tossed with roasted peanuts, cashews, and garlic.", "PRG-KB-37", "330.00", 80, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", savouries, false, 4.6, 21);
        seedProductIfAbsent("Butter Murukku", "Melt-in-mouth crispies prepared with pure white butter, rice flour, and cumin.", "PRG-BM-38", "360.00", 75, "kg", "/images/pexels-kailashkumarphotography-11887844.jpg", savouries, true, 4.8, 35);

        // Festival Hampers & Gift Boxes
        seedProductIfAbsent("Royal Festive Utsav Hamper", "Luxurious velvet gift box containing Kaju Katli, Motichoor Ladoo, Roasted Nuts, and Scented Diya.", "PRG-RUH-40", "1250.00", 50, "box", "/images/pexels-jonathanborba-19863265.jpg", festivalHampers, true, 5.0, 62);
        seedProductIfAbsent("Pragathi Heritage Celebration Box", "Assorted regional specialties: Pootharekulu, Kakinada Kaja, Mysore Pak, and Andhra Mixture.", "PRG-PHC-41", "980.00", 65, "box", "/images/pexels-jonathanborba-19863265.jpg", festivalHampers, true, 4.9, 54);
        seedProductIfAbsent("Shahi Dry Fruit Royal Platter", "Ornate brass-finish tray featuring California Almonds, Afghan Raisins, Walnuts, and Roasted Cashews.", "PRG-SDF-42", "1499.00", 40, "box", "/images/pexels-mehranb-86649.jpg", festivalHampers, true, 5.0, 39);
    }

    private void seedDefaultCoupons() {
        if (couponRepository.count() == 0) {
            log.info("Seeding initial boutique promotional coupons...");
            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("AZADI15")
                    .description("Festive Special — 15% discount across boutique confections")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("15.00"))
                    .minOrderAmount(new java.math.BigDecimal("400.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("250.00"))
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(6))
                    .usageLimit(500)
                    .usedCount(0)
                    .active(true)
                    .build());

            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("RAKHI200")
                    .description("Special Celebration — Flat ₹200 off on festive gift boxes")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.FLAT)
                    .discountValue(new java.math.BigDecimal("200.00"))
                    .minOrderAmount(new java.math.BigDecimal("999.00"))
                    .maxDiscountAmount(null)
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(6))
                    .usageLimit(300)
                    .usedCount(0)
                    .active(true)
                    .build());

            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("SWEET10")
                    .description("Welcome Gift — 10% off for traditional sweets lovers")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("10.00"))
                    .minOrderAmount(new java.math.BigDecimal("299.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("100.00"))
                    .validFrom(java.time.LocalDateTime.now().minusDays(1))
                    .validTo(java.time.LocalDateTime.now().plusMonths(12))
                    .usageLimit(1000)
                    .usedCount(0)
                    .active(true)
                    .build());
            log.info("Boutique coupons seeded successfully (AZADI15, RAKHI200, SWEET10).");
        }

        if (couponRepository.findByCodeIgnoreCase("CIRCLE15").isEmpty()) {
            couponRepository.save(com.ems.pragathisweets.entity.Coupon.builder()
                    .code("CIRCLE15")
                    .description("Pragathi Circle VIP Member Exclusive — 15% off confections")
                    .discountType(com.ems.pragathisweets.entity.DiscountType.PERCENTAGE)
                    .discountValue(new java.math.BigDecimal("15.00"))
                    .minOrderAmount(new java.math.BigDecimal("499.00"))
                    .maxDiscountAmount(new java.math.BigDecimal("300.00"))
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
                    .amount(new java.math.BigDecimal("299.00"))
                    .status(com.ems.pragathisweets.entity.SubscriptionStatus.ACTIVE)
                    .paymentMethod(com.ems.pragathisweets.entity.PaymentMethod.RAZORPAY)
                    .paymentStatus(com.ems.pragathisweets.entity.PaymentStatus.SUCCESS)
                    .paymentId("pay_rzp_mock_vip1")
                    .exclusiveCoupon("CIRCLE15")
                    .discountPercent(15)
                    .startDate(java.time.LocalDateTime.now().minusDays(1))
                    .validTill(java.time.LocalDateTime.now().plusDays(364))
                    .autoRenew(true)
                    .notes("Royale VIP Inner Circle Member")
                    .build());

            subscriptionRepository.save(com.ems.pragathisweets.entity.Subscription.builder()
                    .email("ananya.rao@example.com")
                    .customerName("Ananya Rao")
                    .customerPhone("+91 98123 45678")
                    .planName("PRAGATHI_CIRCLE_VIP")
                    .planTier("VIP")
                    .amount(new java.math.BigDecimal("299.00"))
                    .status(com.ems.pragathisweets.entity.SubscriptionStatus.ACTIVE)
                    .paymentMethod(com.ems.pragathisweets.entity.PaymentMethod.RAZORPAY)
                    .paymentStatus(com.ems.pragathisweets.entity.PaymentStatus.SUCCESS)
                    .paymentId("pay_rzp_mock_vip2")
                    .exclusiveCoupon("CIRCLE15")
                    .discountPercent(15)
                    .startDate(java.time.LocalDateTime.now().minusDays(5))
                    .validTill(java.time.LocalDateTime.now().plusDays(360))
                    .autoRenew(true)
                    .notes("Heritage sweets festive subscriber")
                    .build());

            log.info("Default VIP subscriptions seeded successfully.");
        }
    }
}
