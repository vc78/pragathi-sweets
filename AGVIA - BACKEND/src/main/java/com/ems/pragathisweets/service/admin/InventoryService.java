package com.ems.pragathisweets.service.admin;

import com.ems.pragathisweets.dto.ProductResponse;
import com.ems.pragathisweets.entity.Product;
import com.ems.pragathisweets.exception.ProductNotFoundException;
import com.ems.pragathisweets.mapper.ProductMapper;
import com.ems.pragathisweets.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Value("${app.inventory.low-stock-threshold:10}")
    private int lowStockThreshold;

    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findByStockQuantityLessThanEqualAndActiveTrue(lowStockThreshold).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional
    public ProductResponse adjustStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (quantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }

        product.setStockQuantity(quantity);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse incrementStock(Long productId, int delta) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        int newQuantity = product.getStockQuantity() + delta;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Resulting stock quantity cannot be negative");
        }

        product.setStockQuantity(newQuantity);
        return productMapper.toResponse(productRepository.save(product));
    }
}
