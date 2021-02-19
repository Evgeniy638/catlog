package com.copy.reddit.controller;

import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import com.copy.reddit.service.DetailsService;
import com.copy.reddit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;
    private final DetailsService detailsService;

    @Autowired
    public UserController(UserService userService, DetailsService detailsService) {
        this.userService = userService;
        this.detailsService = detailsService;
    }

    @PostMapping(value = "/users/registration")
    public ResponseEntity<UserDTO> registration(@RequestBody UserDTO userDTO) {
        userService.saveUser(userDTO);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PostMapping(value = "/users/login")
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO){
        PasswordEncoder encoder = User.PASSWORD_ENCODER;

        UserDetails user = detailsService.loadUserByUsername(userDTO.getNickname());

        if (user == null || !encoder.matches(userDTO.getPassword(), user.getPassword())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(userService.codeBase64(userDTO.getNickname(), userDTO.getPassword()), HttpStatus.OK);
    }
}
