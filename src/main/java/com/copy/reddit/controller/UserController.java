package com.copy.reddit.controller;

import com.copy.reddit.dto.LoginDTO;
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

import java.io.UnsupportedEncodingException;

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
    public ResponseEntity<LoginDTO> registration(@RequestBody UserDTO userDTO) {
        if (!userService.saveUser(userDTO)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        LoginDTO loginDTO = new LoginDTO(
                userService.codeBase64(userDTO.getNickname(), userDTO.getPassword()),
                userDTO.getNickname());

        return new ResponseEntity<>(loginDTO, HttpStatus.OK);
    }

    @PostMapping(value = "/users/login")
    public ResponseEntity<LoginDTO> login(@RequestBody UserDTO userDTO){
        PasswordEncoder encoder = User.PASSWORD_ENCODER;

        UserDetails user = detailsService.loadUserByUsername(userDTO.getNickname());

        if (user == null || !encoder.matches(userDTO.getPassword(), user.getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        LoginDTO loginDTO = new LoginDTO(
                userService.codeBase64(userDTO.getNickname(), userDTO.getPassword()),
                userDTO.getNickname());

        return new ResponseEntity<>(loginDTO, HttpStatus.OK);
    }

    @GetMapping(value = "users/nickname")
    public ResponseEntity<String> getNickname(@RequestHeader("Authorization") String authorization) throws UnsupportedEncodingException {
        return new ResponseEntity<>(userService.getNameByAuthorization(authorization), HttpStatus.OK);
    }
}
