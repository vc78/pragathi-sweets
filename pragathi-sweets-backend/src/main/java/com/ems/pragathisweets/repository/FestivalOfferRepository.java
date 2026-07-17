package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.FestivalOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FestivalOfferRepository extends JpaRepository<FestivalOffer, Long> {

    List<FestivalOffer> findByActiveTrue();
}
