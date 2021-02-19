package com.copy.reddit.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.Set;


public class User {
    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();
    private String nickname;
    private String password;
    private String encodePassword;
    private String[] roles = new String[] {"ROLE_USER"};

    public User() {
        super();
    }

    public User(String nickname, String password) {
        this.nickname = nickname;
        setPassword(password);
        setEncodePassword(password);
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public String getEncodePassword() {
        return encodePassword;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEncodePassword(String password) {
        this.encodePassword = PASSWORD_ENCODER.encode(password);
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }
}