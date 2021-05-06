package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DetailsService implements UserDetailsService {
    final UserDAO userDAO;

    public DetailsService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    /**
     * Нужен для настройки поиска пользователя по имени в SpringSecurity
     * @param username имя пользователя
     * @return экземпляр класса org.springframework.security.core.userdetails.User
     * @throws UsernameNotFoundException если пользователь не найден, то выкидывает эту ошибку
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAO.findByUsername(username);
        if (user == null){
            return null;
        }
        return new org.springframework.security.core.userdetails.User(
                user.getNickname(),
                user.getPassword(),
                AuthorityUtils.createAuthorityList(user.getRoles())
        );
    }
}
