package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @Query("select p from Product p where p.active = true and " +
            "(lower(p.name) like lower(concat('%', :keyword, '%')) " +
            "or lower(p.description) like lower(concat('%', :keyword, '%')))")
    Page<Product> search(@org.springframework.data.repository.query.Param("keyword") String keyword, Pageable pageable);

    List<Product> findTop8ByActiveTrueOrderByAvgRatingDesc();

    List<Product> findByStockQuantityLessThanEqualAndActiveTrue(Integer threshold);

    List<Product> findByCategoryIdAndIdNotAndActiveTrue(Long categoryId, Long id, Pageable pageable);

    boolean existsBySkuIgnoreCase(String sku);

    Optional<Product> findBySkuIgnoreCase(String sku);
}
