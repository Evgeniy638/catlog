package com.copy.reddit.dao;

import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.Post;
import com.copy.reddit.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Добавление пользователя в базу данных
     * @param user Объект пользователя
     * @return true, если пользователь добавлен успешно
     */
    public boolean save(User user) {
        try {
            jdbcTemplate.update("INSERT INTO \"User\" (nickname, password, avatar) values (?, ?, ?)",
                    user.getNickname(), user.getEncodePassword(), user.getAvatar());

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Поиск пользователя по нику
     * @param username Ник пользователя
     * @return Пользователь или null
     */
    public User findByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM \"User\" WHERE nickname=?",
                new BeanPropertyRowMapper<>(User.class), username)
                .stream().findFirst().orElse(null);
    }

    public User findById(Integer id) {
        return jdbcTemplate.query("SELECT * FROM \"User\" WHERE id=?",
                new BeanPropertyRowMapper<>(User.class), id)
                .stream().findFirst().orElse(null);
    }

    public String getAvatarImg(String nickname) {
        return jdbcTemplate.query(
                "SELECT avatar FROM \"User\" WHERE nickname=? LIMIT 1 OFFSET 0",
                new BeanPropertyRowMapper<>(User.class), nickname
        ).get(0).getAvatar();
    }

    public Integer getCountPosts(String nickname) {
        String SQL_SELECT = "SELECT count(post.id) FROM \"User\" " +
                "JOIN post ON post.userid = \"User\".id " +
                "WHERE \"User\".nickname = ?";

        return jdbcTemplate.queryForObject(SQL_SELECT, Integer.class, nickname);
    }

    public Integer getCountLikes(String nickname) {
        String SQL_SELECT = "SELECT count(\"Like\".postid) FROM \"User\" " +
                "JOIN post ON post.userid = \"User\".id " +
                "JOIN \"Like\" ON post.id = \"Like\".postid " +
                "WHERE \"User\".nickname = ?";

        return jdbcTemplate.queryForObject(SQL_SELECT, Integer.class, nickname);
    }

    public void subscribe(String nickname, String following) {
        String SQL_UPDATE = "INSERT INTO subscription (nickname, follower) VALUES (?, ?)";
        jdbcTemplate.update(SQL_UPDATE, following, nickname);
    }

    public void unsubscribe(String nickname, String following) {
        String SQL_DELETE = "DELETE FROM subscription WHERE nickname=? AND follower=?";
        jdbcTemplate.update(SQL_DELETE, following, nickname);
    }

    public boolean isSubscribe(String nickname, String following) {
        String SQL_SELECT = "SELECT COUNT(subscription.follower) FROM subscription " +
                "WHERE subscription.nickname = ? AND subscription.follower = ?";

        return jdbcTemplate.queryForObject(SQL_SELECT, Integer.class, following, nickname) > 0;
    }

    public Integer getCountFollowers(String nickname) {
        String SQL_SELECT = "SELECT COUNT(subscription.follower) FROM subscription " +
                "WHERE subscription.nickname = ?";
        return jdbcTemplate.queryForObject(SQL_SELECT, Integer.class, nickname);
    }

    public Integer getCountFollowings(String nickname) {
        String SQL_SELECT = "SELECT COUNT(subscription.nickname) FROM subscription " +
                "WHERE subscription.follower = ?";
        return jdbcTemplate.queryForObject(SQL_SELECT, Integer.class, nickname);
    }

    public List<String> getAllFollowers(String nickname) {
        String SQL_SELECT = "SELECT subscription.follower FROM subscription " +
                "WHERE subscription.nickname = ?";
        return jdbcTemplate.queryForList(SQL_SELECT, String.class, nickname);
    }

    public List<String> getAllFollowings(String nickname) {
        String SQL_SELECT = "SELECT subscription.nickname FROM subscription " +
                "WHERE subscription.follower = ?";
        return jdbcTemplate.queryForList(SQL_SELECT, String.class, nickname);
    }
}
