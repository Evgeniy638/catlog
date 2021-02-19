package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class DetailsService implements UserDetailsService {
    final UserDAO userDAO;

    public DetailsService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String username){
        UserDTO user = userDAO.findByUsername(username);
        if (user == null){
            try {
                throw new Exception(username + " was not found");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new org.springframework.security.core.userdetails.User(
                user.getNickname(),
                user.getPassword(),
                AuthorityUtils.createAuthorityList(new String[]{"USER"})
        );
    }
}
