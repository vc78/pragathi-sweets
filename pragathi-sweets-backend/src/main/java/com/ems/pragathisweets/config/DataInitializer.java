package com.ems.pragathisweets.config;

import com.ems.pragathisweets.entity.Category;
import com.ems.pragathisweets.entity.Product;
import com.ems.pragathisweets.entity.Role;
import com.ems.pragathisweets.entity.User;
import com.ems.pragathisweets.repository.CategoryRepository;
import com.ems.pragathisweets.repository.ProductRepository;
import com.ems.pragathisweets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Initializes AGVIA Women's Wear Boutique:
 * - Bootstraps the default AGVIA Administrator account (admin@agvia.com)
 * - Seeds the 7 official AGVIA categories
 * - Seeds the exact 10 official AGVIA products with local fashion imagery
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@agvia.com}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password:agvia@123}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name:AGVIA Administrator}")
    private String defaultAdminName;

    @Override
    public void run(String... args) {
        bootstrapAdminUser();
        seedAgviaCategoriesAndProducts();
    }

    private void bootstrapAdminUser() {
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
            log.info("AGVIA Admin account initialized successfully: {}", defaultAdminEmail);
        }
    }

    private void seedAgviaCategoriesAndProducts() {
        log.info("Seeding AGVIA official categories and 10 catalog products...");

        Category sarees = getOrCreateCategory("Sarees", "Elegant silk, organza, and festive sarees crafted for special occasions.", "/images/classic_silk_saree.jpg");
        Category lehengas = getOrCreateCategory("Lehengas", "Bridal and festive lehengas with regal silhouettes and intricate embroidery.", "/images/wedding_lehenga.jpg");
        Category anarkalis = getOrCreateCategory("Anarkalis & Kurtas", "Flowing Anarkalis and comfortable designer kurta sets for every celebration.", "/images/anarkali_set.jpg");
        Category dresses = getOrCreateCategory("Dresses & Gowns", "Graceful evening gowns and contemporary occasion wear.", "/images/evening_gown.jpg");
        Category western = getOrCreateCategory("Western Wear", "Chic modern co-ord sets and versatile everyday contemporary pieces.", "/images/coord_set.jpg");
        Category kurtis = getOrCreateCategory("Kurtis", "Everyday and festive kurtis designed with timeless Indian charm.", "/images/festive_kurti.jpg");
        Category dupattas = getOrCreateCategory("Dupattas", "Embellished and sheer bridal dupattas to complete festive looks.", "/images/bridal_dupatta.jpg");

        // Exactly 20 AGVIA Catalog Products
        seedProductIfAbsent("AGVIA Classic Silk Saree", "Elegant silk saree for festive occasions, family functions and traditional celebrations.", "AGV-SAR-001", "4999.00", 25, "piece", "/images/classic_silk_saree.jpg", sarees, true);
        seedProductIfAbsent("AGVIA Floral Organza Saree", "Lightweight organza saree with a soft floral look, ideal for festivals and evening occasions.", "AGV-SAR-002", "3999.00", 20, "piece", "/images/floral_organza_saree.jpg", sarees, false);
        seedProductIfAbsent("AGVIA Embroidered Anarkali Set", "Comfortable flowing Anarkali with delicate embroidery for festive and family occasions.", "AGV-ANK-003", "3499.00", 30, "set", "/images/anarkali_set.jpg", anarkalis, true);
        seedProductIfAbsent("AGVIA Everyday Kurta Set", "Simple and comfortable kurta set designed for everyday wear, college, office and casual occasions.", "AGV-ANK-004", "1999.00", 40, "set", "/images/everyday_kurta_set.jpg", anarkalis, false);
        seedProductIfAbsent("AGVIA Festive Lehenga Set", "Beautiful festive lehenga set with elegant detailing for weddings and celebrations.", "AGV-LEH-005", "5999.00", 15, "set", "/images/festive_lehenga_set.jpg", lehengas, true);
        seedProductIfAbsent("AGVIA Embroidered Wedding Lehenga", "Premium embroidered lehenga designed for weddings, receptions and special celebrations.", "AGV-LEH-006", "8999.00", 12, "set", "/images/wedding_lehenga.jpg", lehengas, true);
        seedProductIfAbsent("AGVIA Evening Gown", "Elegant evening gown with a graceful silhouette for parties, dinners and celebrations.", "AGV-DRS-007", "3499.00", 18, "piece", "/images/evening_gown.jpg", dresses, false);
        seedProductIfAbsent("AGVIA Co-ord Set", "Modern matching outfit designed for a clean, comfortable and stylish everyday look.", "AGV-WST-008", "1799.00", 35, "set", "/images/coord_set.jpg", western, false);
        seedProductIfAbsent("AGVIA Festive Kurti", "Easy-to-wear festive kurti with a simple ethnic design for everyday Indian occasions.", "AGV-KRT-009", "1499.00", 45, "piece", "/images/festive_kurti.jpg", kurtis, false);
        seedProductIfAbsent("AGVIA Bridal Dupatta", "Elegant embellished dupatta designed to complement festive and bridal outfits.", "AGV-DUP-010", "1299.00", 30, "piece", "/images/bridal_dupatta.jpg", dupattas, false);

        seedProductIfAbsent("AGVIA Kanjeevaram Gold Silk Saree", "Heirloom pure Kanjeevaram silk saree with rich zari border and pallu.", "AGV-SAR-011", "6499.00", 15, "piece", "/images/classic_silk_saree.jpg", sarees, true);
        seedProductIfAbsent("AGVIA Pastel Banarasi Georgette Saree", "Soft drape pastel saree with hand-woven zari buttas for day festivities.", "AGV-SAR-012", "4599.00", 18, "piece", "/images/floral_organza_saree.jpg", sarees, false);
        seedProductIfAbsent("AGVIA Royal Crimson Velvet Lehenga", "Exquisite bridal crimson velvet lehenga with handcrafted zardozi embroidery.", "AGV-LEH-013", "9999.00", 10, "set", "/images/wedding_lehenga.jpg", lehengas, true);
        seedProductIfAbsent("AGVIA Champagne Mirror-Work Lehenga", "Light-catching festive lehenga with intricate mirror and threadwork detailing.", "AGV-LEH-014", "6999.00", 14, "set", "/images/festive_lehenga_set.jpg", lehengas, false);
        seedProductIfAbsent("AGVIA Chikankari Angrakha Anarkali", "Graceful Lucknowi Chikankari angrakha style set with matching churidar.", "AGV-ANK-015", "3899.00", 22, "set", "/images/anarkali_set.jpg", anarkalis, false);
        seedProductIfAbsent("AGVIA Chanderi Silk Festive Kurta", "Breathable Chanderi silk kurta with foil print and delicate gotta patti work.", "AGV-ANK-016", "2499.00", 28, "set", "/images/everyday_kurta_set.jpg", anarkalis, false);
        seedProductIfAbsent("AGVIA Emerald Pleated Cocktail Gown", "Floor-sweeping pleated gown with an asymmetric neckline for gala receptions.", "AGV-DRS-017", "4299.00", 16, "piece", "/images/evening_gown.jpg", dresses, false);
        seedProductIfAbsent("AGVIA Satin Wrap Resort Dress", "Sleek flowing satin wrap dress designed for modern evening soirées.", "AGV-DRS-018", "2799.00", 20, "piece", "/images/evening_gown.jpg", dresses, false);
        seedProductIfAbsent("AGVIA Linen Blazer & Trousers Set", "Sophisticated contemporary co-ord set with clean lines and tailored fit.", "AGV-WST-019", "3199.00", 24, "set", "/images/coord_set.jpg", western, false);
        seedProductIfAbsent("AGVIA Organza Zari Scalloped Dupatta", "Airy sheer organza dupatta with golden scalloped border embroidery.", "AGV-DUP-020", "1699.00", 35, "piece", "/images/bridal_dupatta.jpg", dupattas, false);

        log.info("AGVIA categories and 20 products initialization verified.");
    }

    private Category getOrCreateCategory(String name, String description, String imageUrl) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .description(description)
                        .imageUrl(imageUrl)
                        .active(true)
                        .build()));
    }

    private void seedProductIfAbsent(String name, String description, String sku, String price, int stock, String unit, String image, Category category, boolean bestseller) {
        if (!productRepository.existsBySkuIgnoreCase(sku)) {
            productRepository.save(Product.builder()
                    .name(name)
                    .description(description)
                    .sku(sku)
                    .price(new BigDecimal(price))
                    .stockQuantity(stock)
                    .unit(unit)
                    .imageUrl(image)
                    .category(category)
                    .bestseller(bestseller)
                    .avgRating(0.0)
                    .numReviews(0)
                    .active(true)
                    .build());
        }
    }
}
