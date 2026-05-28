package com.example.hotelbooking.services.impl;

import com.example.hotelbooking.dtos.NotificationDTO;
import com.example.hotelbooking.repositories.NotificationRepository;
import com.example.hotelbooking.services.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender javaMailSender;
    private final NotificationRepository notificationRepository;

    @Override
    public void sendEmail(NotificationDTO notificationDTO) {

        try {

            log.info("EMAIL START → {}", notificationDTO.getRecipient());

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(notificationDTO.getRecipient());
            message.setSubject(notificationDTO.getSubject());
            message.setText(notificationDTO.getBody());

            javaMailSender.send(message);

            log.info("EMAIL SENT SUCCESSFULLY ✔");

        } catch (Exception e) {

            log.error("EMAIL FAILED", e);

        }
    }

    @Override
    public void sendSms() {

    }

    @Override
    public void sendWhatsapp() {

    }
}