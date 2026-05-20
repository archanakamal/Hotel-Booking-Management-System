package com.example.hotelbooking.repositories;

import com.example.hotelbooking.entities.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}
