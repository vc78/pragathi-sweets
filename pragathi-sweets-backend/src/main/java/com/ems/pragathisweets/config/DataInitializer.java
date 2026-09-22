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
    }

    private void seedDefaultCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding default boutique categories...");
            var milkSweets = categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                    .name("Milk Sweets")
                    .description("Indulgent classics prepared from pure condensed milk solids.")
                    .imageUrl("/images/pexels-divigraphy-8624624.jpg")
                    .active(true)
                    .build());

            var dryFruitSweets = categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                    .name("Dry Fruit Sweets")
                    .description("Luxurious confections crafted from organic nuts and silver varq.")
                    .imageUrl("/images/pexels-gaurav-kumar-1281378-18488298.jpg")
                    .active(true)
                    .build());

            var bengaliSweets = categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                    .name("Bengali Sweets")
                    .description("Spongy chhena delicacies soaked in light cardamom syrup.")
                    .imageUrl("/images/pexels-gaurav-kumar-1281378-18488316.jpg")
                    .active(true)
                    .build());

            var savouries = categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                    .name("Savouries")
                    .description("Crunchy, salted blends prepared in wood-pressed oils.")
                    .imageUrl("/images/pexels-kailashkumarphotography-11887844.jpg")
                    .active(true)
                    .build());

            var festivalHampers = categoryRepository.save(com.ems.pragathisweets.entity.Category.builder()
                    .name("Festival Hampers")
                    .description("Curated premium hampers for festive celebrations.")
                    .imageUrl("/images/pexels-jonathanborba-19863265.jpg")
                    .active(true)
                    .build());

            if (productRepository.count() == 0) {
                log.info("Seeding initial boutique confections...");
                productRepository.save(com.ems.pragathisweets.entity.Product.builder()
                        .name("Royal Kaju Katli")
                        .description("Thin diamond-cut fudge handcrafted from premium Goan cashews and edible silver leaf.")
                        .sku("PRG-KK-01")
                        .price(new java.math.BigDecimal("620.00"))
                        .stockQuantity(100)
                        .unit("kg")
                        .imageUrl("/images/pexels-gaurav-kumar-1281378-18488298.jpg")
                        .category(dryFruitSweets)
                        .bestseller(true)
                        .avgRating(4.9)
                        .numReviews(42)
                        .active(true)
                        .build());

                productRepository.save(com.ems.pragathisweets.entity.Product.builder()
                        .name("Pure Ghee Motichoor Ladoo")
                        .description("Delicate tiny gram flour pearls fried in organic A2 desi ghee and infused with saffron.")
                        .sku("PRG-ML-02")
                        .price(new java.math.BigDecimal("480.00"))
                        .stockQuantity(80)
                        .unit("kg")
                        .imageUrl("/images/pexels-divigraphy-8624624.jpg")
                        .category(milkSweets)
                        .bestseller(true)
                        .avgRating(4.8)
                        .numReviews(38)
                        .active(true)
                        .build());

                productRepository.save(com.ems.pragathisweets.entity.Product.builder()
                        .name("Kolkata Saffron Rasgulla")
                        .description("Pristine soft chhena spheres bathed in organic saffron-infused sugar elixir.")
                        .sku("PRG-RG-03")
                        .price(new java.math.BigDecimal("420.00"))
                        .stockQuantity(65)
                        .unit("box")
                        .imageUrl("/images/pexels-gaurav-kumar-1281378-18488316.jpg")
                        .category(bengaliSweets)
                        .bestseller(false)
                        .avgRating(4.7)
                        .numReviews(25)
                        .active(true)
                        .build());

                productRepository.save(com.ems.pragathisweets.entity.Product.builder()
                        .name("Special Bellam Pootharekulu")
                        .description("Traditional paper-thin rice wafers layered with organic jaggery, ghee, and roasted dry fruits.")
                        .sku("PRG-BP-04")
                        .price(new java.math.BigDecimal("750.00"))
                        .stockQuantity(40)
                        .unit("box")
                        .imageUrl("/images/pexels-jonathanborba-19863265.jpg")
                        .category(festivalHampers)
                        .bestseller(true)
                        .avgRating(5.0)
                        .numReviews(56)
                        .active(true)
                        .build());
            }
        }
    }
}
