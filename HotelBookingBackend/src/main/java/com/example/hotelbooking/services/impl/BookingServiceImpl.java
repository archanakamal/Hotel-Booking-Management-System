package com.example.hotelbooking.services.impl;

import com.example.hotelbooking.dtos.BookingDTO;
import com.example.hotelbooking.dtos.NotificationDTO;
import com.example.hotelbooking.dtos.Response;
import com.example.hotelbooking.entities.Booking;
import com.example.hotelbooking.entities.Room;
import com.example.hotelbooking.entities.User;
import com.example.hotelbooking.enums.BookingStatus;
import com.example.hotelbooking.enums.PaymentStatus;
import com.example.hotelbooking.exceptions.InvalidBookingStateAndDateException;
import com.example.hotelbooking.exceptions.NotFoundException;
import com.example.hotelbooking.repositories.BookingRepository;
import com.example.hotelbooking.repositories.RoomRepository;
import com.example.hotelbooking.services.BookingCodeGenerator;
import com.example.hotelbooking.services.BookingService;
import com.example.hotelbooking.services.NotificationService;
import com.example.hotelbooking.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {


    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final BookingCodeGenerator bookingCodeGenerator;


    @Override
    public Response getAllBookings() {
        List<Booking> bookingList =bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<BookingDTO> bookingDTOList = modelMapper.map(bookingList, new TypeToken<List<BookingDTO>>() {}.getType());

        for(BookingDTO bookingDTO: bookingDTOList){
            bookingDTO.setUser(null);
            bookingDTO.setRoom(null);
        }

        return Response.builder()
                .status(200)
                .message("success")
                .bookings(bookingDTOList)
                .build();
    }

    @Override
    public Response createBooking(BookingDTO bookingDTO) {

        User currentUser = userService.getCurrentLoggedInUser();

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new NotFoundException("Room Not Found"));

        // ✅ Validation: check-in not before today
        if (bookingDTO.getCheckInDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingStateAndDateException(
                    "Check-in date cannot be before today"
            );
        }

        // ✅ FIXED: check-out must be after check-in
        if (bookingDTO.getCheckOutDate().isBefore(bookingDTO.getCheckInDate())) {
            throw new InvalidBookingStateAndDateException(
                    "Check-out date cannot be before check-in date"
            );
        }

        // ❌ removed invalid same-field comparison bug

        // validate availability
        boolean isAvailable = bookingRepository.isRoomAvailable(
                room.getId(),
                bookingDTO.getCheckInDate(),
                bookingDTO.getCheckOutDate()
        );

        if (!isAvailable) {
            throw new InvalidBookingStateAndDateException(
                    "Room is not available for selected dates"
            );
        }

        // price calculation
        BigDecimal totalPrice = calculateTotalPrice(room, bookingDTO);
        String bookingReference = bookingCodeGenerator.generateBookingReference();

        // create booking
        Booking booking = new Booking();
        booking.setUser(currentUser);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(totalPrice);
        booking.setBookingReference(bookingReference);
        booking.setBookingStatus(BookingStatus.BOOKED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // payment link (KEEP backend URL later for production)
        String paymentUrl =
                "https://your-frontend.vercel.app/payment/"
                        + bookingReference + "/" + totalPrice;

        log.info("PAYMENT LINK: {}", paymentUrl);

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(currentUser.getEmail())
                .subject("Booking Confirmation")
                .body("Your booking is successful. Pay here:\n" + paymentUrl)
                .bookingReference(bookingReference)
                .build();

        notificationService.sendEmail(notificationDTO);

        BookingDTO responseDTO = modelMapper.map(savedBooking, BookingDTO.class);

        return Response.builder()
                .status(200)
                .message("Booking created successfully")
                .booking(responseDTO)
                .build();
    }

    @Override
    public Response findBookingByReferenceNo(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(()-> new NotFoundException("Booking with reference No: " + bookingReference + "Not found"));

        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
        return  Response.builder()
                .status(200)
                .message("success")
                .booking(bookingDTO)
                .build();
    }

    @Override
    public Response updateBooking(BookingDTO bookingDTO) {
        if (bookingDTO.getId() == null) throw new NotFoundException("Booking id is required");

        Booking existingBooking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(()-> new NotFoundException("Booking Not Found"));

        if (bookingDTO.getBookingStatus() != null) {
            existingBooking.setBookingStatus(bookingDTO.getBookingStatus());
        }

        if (bookingDTO.getPaymentStatus() != null) {
            existingBooking.setPaymentStatus(bookingDTO.getPaymentStatus());
        }

        bookingRepository.save(existingBooking);

        return Response.builder()
                .status(200)
                .message("Booking Updated Successfully")
                .build();
    }


    private BigDecimal calculateTotalPrice(Room room, BookingDTO bookingDTO){
        BigDecimal pricePerNight = room.getPricePerNight();
        long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        return pricePerNight.multiply(BigDecimal.valueOf(days));
    }





}
