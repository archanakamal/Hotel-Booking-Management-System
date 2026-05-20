package com.example.hotelbooking.services;

import com.example.hotelbooking.dtos.LoginRequest;
import com.example.hotelbooking.dtos.RegistrationRequest;
import com.example.hotelbooking.dtos.Response;
import com.example.hotelbooking.dtos.UserDTO;
import com.example.hotelbooking.entities.User;

public interface UserService {

    Response registerUser(RegistrationRequest registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    Response getOwnAccountDetails();
    User getCurrentLoggedInUser();
    Response updateOwnAccount(UserDTO userDTO);
    Response deleteOwnAccount();
    Response getMyBookingHistory();
}
