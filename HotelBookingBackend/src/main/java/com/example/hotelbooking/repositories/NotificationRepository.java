package com.example.hotelbooking.repositories;

import com.example.hotelbooking.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
