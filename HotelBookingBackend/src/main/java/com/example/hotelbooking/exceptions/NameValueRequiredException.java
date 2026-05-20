package com.example.hotelbooking.exceptions;

public class NameValueRequiredException extends RuntimeException {
    public NameValueRequiredException(String message) {
        super(message);
    }
}
