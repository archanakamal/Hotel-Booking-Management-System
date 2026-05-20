package com.example.hotelbooking.exceptions;

public class InvalidBookingStateAndDateException extends RuntimeException {
    public InvalidBookingStateAndDateException(String message) {
        super(message);
    }
}
