package com.copy.reddit.dao;

import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostDAO{
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PostDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Post post) {
        jdbcTemplate.update("INSERT INTO post (id, text, userid, time) values (?, ?, ?, ?)",
                post.getId(), post.getText(), post.getUserId(), post.getTime());
    }

    public boolean update(String text, int id) {
        return jdbcTemplate.update("UPDATE post SET text=? WHERE id=?",
                text, id) > 0;
    }

    public boolean delete(int id) {
        return jdbcTemplate.update("DELETE FROM post WHERE id=?", id) > 0;
    }

    public List<Post> findByTag(String tagName) {
        return jdbcTemplate.query("SELECT post.id, post.text, post.userid, post.time FROM tag JOIN tagandpost ON tag.id = tagandpost.tagid JOIN post ON  post.id = tagandpost.postid where tag.name=?", new BeanPropertyRowMapper<>(Post.class), tagName);
    }

    public List<Post> findAll() {
        return jdbcTemplate.query("SELECT * FROM post",  new BeanPropertyRowMapper<>(Post.class));
    }
}
