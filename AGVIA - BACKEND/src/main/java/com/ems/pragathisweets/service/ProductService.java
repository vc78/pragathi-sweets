package com.ems.pragathisweets.service;

import com.ems.pragathisweets.dto.ProductRequest;
import com.ems.pragathisweets.dto.ProductResponse;
import com.ems.pragathisweets.entity.Category;
import com.ems.pragathisweets.entity.Product;
import com.ems.pragathisweets.exception.DuplicateResourceException;
import com.ems.pragathisweets.exception.ProductNotFoundException;
import com.ems.pragathisweets.exception.ResourceNotFoundException;
import com.ems.pragathisweets.mapper.ProductMapper;
import com.ems.pragathisweets.repository.CategoryRepository;
import com.ems.pragathisweets.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAll(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String keyword, Pageable pageable) {
        return productRepository.search(keyword, pageable).map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return productMapper.toResponse(findEntity(id));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeatured() {
        return productRepository.findTop8ByActiveTrueOrderByAvgRatingDesc().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getRelated(Long id, int limit) {
        Product product = findEntity(id);
        Long categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        List<Product> list;
        if (categoryId != null) {
            list = new java.util.ArrayList<>(productRepository.findByCategoryIdAndIdNotAndActiveTrue(categoryId, id, pageable));
        } else {
            list = new java.util.ArrayList<>();
        }
        if (list.size() < limit) {
            List<Product> fallback = productRepository.findTop8ByActiveTrueOrderByAvgRatingDesc().stream()
                    .filter(p -> !p.getId().equals(id) && list.stream().noneMatch(existing -> existing.getId().equals(p.getId())))
                    .limit(limit - list.size())
                    .toList();
            list.addAll(fallback);
        }
        return list.stream().map(productMapper::toResponse).toList();
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (request.getSku() != null && !request.getSku().isBlank()
                && productRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateResourceException("A product with SKU " + request.getSku() + " already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .category(category)
                .active(request.getActive() == null || request.getActive())
                .avgRating(0.0)
                .numReviews(0)
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findEntity(id);

        if (request.getSku() != null && !request.getSku().isBlank()
                && !request.getSku().equalsIgnoreCase(product.getSku())
                && productRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateResourceException("A product with SKU " + request.getSku() + " already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findEntity(id);
        product.setActive(false);
        productRepository.save(product);
    }

    protected Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Transactional
    public void recalculateRating(Long productId, double newAvg, int newCount) {
        Product product = findEntity(productId);
        product.setAvgRating(newAvg);
        product.setNumReviews(newCount);
        productRepository.save(product);
    }
}
