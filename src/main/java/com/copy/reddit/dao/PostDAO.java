package com.copy.reddit.dao;

import com.copy.reddit.model.Post;
import com.copy.reddit.model.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PostDAO{
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PostDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Post post) {
        String POST_INSERT_SQL = "INSERT INTO Post (text, userid, time) values (?, ?, ?)";
        KeyHolder postKeyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(POST_INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, post.getText());
                    ps.setInt(2, post.getUserId());
                    ps.setInt(3, post.getTime());
                    return ps;
                },
                postKeyHolder);

        ArrayList<Integer> tagsId = new ArrayList<>();

        for(Tag tag: post.getTagList()) {
            tagsId.add(saveTag(tag));
        }

        for (Integer tagId: tagsId) {
            saveTagAndPost(tagId, (Integer) postKeyHolder.getKeyList().get(0).get("id"));
        }
    }

    public void saveTagAndPost(int tagId, int postId) {
        jdbcTemplate.update("INSERT INTO tagandpost (tagid, postid) VALUES (?, ?)", tagId, postId);
    }

    public int saveTag(Tag tag) {
        String TAG_INSERT_SQL = "INSERT INTO \"tag\" (\"name\") VALUES (?) ON CONFLICT (name) DO UPDATE SET \"name\" = ?;";
        KeyHolder key = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(TAG_INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, tag.getName());
                    ps.setString(2, tag.getName());
                    return ps;
                },
                key);
        return (int) key.getKeyList().get(0).get("id");
    }

    public boolean update(String text, int id) {
        return jdbcTemplate.update("UPDATE post SET text=? WHERE id=?",
                text, id) > 0;
    }

    public boolean delete(int id) {
        return jdbcTemplate.update("DELETE FROM post WHERE id=?", id) > 0;
    }

    public List<Post> findByTag(String tagName) {
        List<Post> posts = jdbcTemplate.query("SELECT post.id, post.text, post.userid, post.time FROM tag JOIN tagandpost ON tag.id = tagandpost.tagid JOIN post ON  post.id = tagandpost.postid where tag.name=?", new BeanPropertyRowMapper<>(Post.class), tagName);

        for (Post post : posts) {
            List<Tag> tags = jdbcTemplate.query("SELECT tag.id, tag.name FROM post JOIN tagandpost ON post.id = tagandpost.postid JOIN tag ON tag.id = tagandpost.tagid WHERE post.id=?", new BeanPropertyRowMapper<>(Tag.class), post.getId());
            post.setTagList(tags);
        }

        return posts;
    }

    public List<Post> findAll() {
        return jdbcTemplate.query("SELECT * FROM post",  new BeanPropertyRowMapper<>(Post.class));
    }
}
