package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.Role;
import com.copy.reddit.model.User;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
//import java.util.Base64;
import java.util.Collections;

@Service
public class UserService {
    private final UserDAO userDAO;

    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public boolean saveUser(UserDTO userDTO) {
        User user = new User(userDTO.getNickname(), userDTO.getPassword());
        return userDAO.save(user);
    }

    public String codeBase64(String nickname, String password) {
        String auth = nickname + ":" + password;
        byte[] encodedAuth = Base64.encodeBase64(
                auth.getBytes(Charset.forName("US-ASCII")) );
        return "Basic " + new String( encodedAuth );
    }

    public String getNameByAuthorization(String authorization) throws UnsupportedEncodingException {
        String code = authorization.replace("Basic ", "");
        return new String(Base64.decodeBase64(code), "US-ASCII").split(":")[0];
    }
}
