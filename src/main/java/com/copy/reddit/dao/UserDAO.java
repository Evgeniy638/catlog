package com.copy.reddit.dao;

import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.Post;
import com.copy.reddit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean save(User user) {
        try {
            jdbcTemplate.update("INSERT INTO \"User\" (nickname, password) values (?, ?)",
                    user.getNickname(), user.getEncodePassword());

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public User findByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM \"User\" WHERE nickname=?",
                new BeanPropertyRowMapper<>(User.class), username)
                .stream().findFirst().orElse(null);
    }

}
