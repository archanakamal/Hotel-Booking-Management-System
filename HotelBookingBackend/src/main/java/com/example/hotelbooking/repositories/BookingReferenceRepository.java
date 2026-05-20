package com.example.hotelbooking.repositories;

import com.example.hotelbooking.entities.BookingReference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingReferenceRepository extends JpaRepository<BookingReference, Long> {

    Optional<BookingReference> findByReferenceNo(String referenceNo);
}
