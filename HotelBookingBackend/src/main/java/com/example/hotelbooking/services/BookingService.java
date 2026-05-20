package com.example.hotelbooking.services;

import com.example.hotelbooking.dtos.BookingDTO;
import com.example.hotelbooking.dtos.Response;

public interface BookingService {

    Response getAllBookings();
    Response createBooking(BookingDTO bookingDTO);
    Response findBookingByReferenceNo(String  bookingReference);
    Response updateBooking(BookingDTO bookingDTO);
}
