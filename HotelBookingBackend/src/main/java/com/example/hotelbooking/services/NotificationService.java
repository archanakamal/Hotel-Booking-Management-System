package com.example.hotelbooking.services;

import com.example.hotelbooking.dtos.NotificationDTO;

public interface NotificationService {

    void sendEmail(NotificationDTO notificationDTO);

    void sendSms();

    void sendWhatsapp();
}
