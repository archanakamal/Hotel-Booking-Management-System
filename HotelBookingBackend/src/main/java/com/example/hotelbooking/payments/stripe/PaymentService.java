package com.example.hotelbooking.payments.stripe;


import com.example.hotelbooking.dtos.NotificationDTO;
import com.example.hotelbooking.entities.Booking;
import com.example.hotelbooking.entities.PaymentEntity;
import com.example.hotelbooking.enums.NotificationType;
import com.example.hotelbooking.enums.PaymentGateway;
import com.example.hotelbooking.enums.PaymentStatus;
import com.example.hotelbooking.exceptions.NotFoundException;
import com.example.hotelbooking.payments.stripe.dto.PaymentRequest;
import com.example.hotelbooking.repositories.BookingRepository;
import com.example.hotelbooking.repositories.PaymentRepository;
import com.example.hotelbooking.services.NotificationService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Value("${stripe.api.secret.key}")
    private String secreteKey;


    public String createPaymentIntent(PaymentRequest paymentRequest){
        log.info("Inside createPaymentIntent()");
        Stripe.apiKey = secreteKey;
        String bookingReference = paymentRequest.getBookingReference();


        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED) {
            throw new NotFoundException("Payment already made for this booking");

        }

        try{
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).longValue()) //amount cents
                    .setCurrency("usd")
                    .putMetadata("bookingReference", bookingReference)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();

        }catch (Exception e){
            throw new RuntimeException("Error creating payment intent");
        }

    }


    public void updatePaymentBooking(PaymentRequest paymentRequest) {

        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        PaymentEntity payment = new PaymentEntity();
        payment.setPaymentGateway(PaymentGateway.STRIPE);
        payment.setAmount(paymentRequest.getAmount());
        payment.setTransactionId(paymentRequest.getTransactionId());
        payment.setPaymentStatus(paymentRequest.isSuccess()
                ? PaymentStatus.COMPLETED
                : PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setBookingReference(bookingReference);
        payment.setUser(booking.getUser());

        paymentRepository.save(payment);

        booking.setPaymentStatus(paymentRequest.isSuccess()
                ? PaymentStatus.COMPLETED
                : PaymentStatus.FAILED);

        bookingRepository.save(booking);

        NotificationDTO dto = NotificationDTO.builder()
                .recipient(booking.getUser().getEmail())
                .bookingReference(bookingReference)
                .build();

        if (paymentRequest.isSuccess()) {

            dto.setSubject("🎉 Payment Successful");
            dto.setBody("Your booking is confirmed! Ref: " + bookingReference);

        } else {

            dto.setSubject("❌ Payment Failed");
            dto.setBody("Payment failed for booking: " + bookingReference);
        }

        notificationService.sendEmail(dto);
    }










}
