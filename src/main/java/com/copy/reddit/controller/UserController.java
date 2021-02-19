package com.copy.reddit.controller;

import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import com.copy.reddit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/user/registration")
    public ResponseEntity<UserDTO> registration(@RequestBody UserDTO userDTO) {
        System.out.println(userDTO.getNickname() + " " + userDTO.getPassword());
        userService.saveUser(userDTO);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
}
