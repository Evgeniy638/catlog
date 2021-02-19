package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.Role;
import com.copy.reddit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserDAO userDAO;

    @Autowired
    public UserService(BCryptPasswordEncoder bCryptPasswordEncoder, UserDAO userDAO) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userDAO = userDAO;
    }

    public boolean saveUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getNickname());
        user.setRoles(Collections.singleton(new Role("ROLE_USER")));
        user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        userDAO.save(user);
        return true;
    }
}
