package com.ems.pragathisweets.mapper;

import com.ems.pragathisweets.dto.ProductResponse;
import com.ems.pragathisweets.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .effectivePrice(product.getEffectivePrice())
                .stockQuantity(product.getStockQuantity())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .bestseller(product.isBestseller())
                .avgRating(product.getAvgRating())
                .numReviews(product.getNumReviews())
                .inStock(product.isInStock())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
