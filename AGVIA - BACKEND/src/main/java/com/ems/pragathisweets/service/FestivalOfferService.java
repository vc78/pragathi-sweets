package com.ems.pragathisweets.service;

import com.ems.pragathisweets.dto.FestivalOfferRequest;
import com.ems.pragathisweets.dto.FestivalOfferResponse;
import com.ems.pragathisweets.entity.Category;
import com.ems.pragathisweets.entity.FestivalOffer;
import com.ems.pragathisweets.exception.ResourceNotFoundException;
import com.ems.pragathisweets.repository.CategoryRepository;
import com.ems.pragathisweets.repository.FestivalOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FestivalOfferService {

    private final FestivalOfferRepository festivalOfferRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<FestivalOfferResponse> getActive() {
        return festivalOfferRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FestivalOfferResponse> getAll() {
        return festivalOfferRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public FestivalOfferResponse create(FestivalOfferRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        FestivalOffer offer = FestivalOffer.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .discountPercentage(request.getDiscountPercentage())
                .imageUrl(request.getImageUrl())
                .category(category)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive() == null || request.getActive())
                .build();

        return toResponse(festivalOfferRepository.save(offer));
    }

    @Transactional
    public FestivalOfferResponse update(Long id, FestivalOfferRequest request) {
        FestivalOffer offer = festivalOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival offer not found with id: " + id));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setDiscountPercentage(request.getDiscountPercentage());
        offer.setImageUrl(request.getImageUrl());
        offer.setCategory(category);
        offer.setStartDate(request.getStartDate());
        offer.setEndDate(request.getEndDate());
        if (request.getActive() != null) {
            offer.setActive(request.getActive());
        }

        return toResponse(festivalOfferRepository.save(offer));
    }

    @Transactional
    public void delete(Long id) {
        FestivalOffer offer = festivalOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival offer not found with id: " + id));
        offer.setActive(false);
        festivalOfferRepository.save(offer);
    }

    private FestivalOfferResponse toResponse(FestivalOffer offer) {
        return FestivalOfferResponse.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .discountPercentage(offer.getDiscountPercentage())
                .imageUrl(offer.getImageUrl())
                .categoryId(offer.getCategory() != null ? offer.getCategory().getId() : null)
                .categoryName(offer.getCategory() != null ? offer.getCategory().getName() : null)
                .startDate(offer.getStartDate())
                .endDate(offer.getEndDate())
                .active(offer.isActive())
                .live(offer.isLive())
                .build();
    }
}
