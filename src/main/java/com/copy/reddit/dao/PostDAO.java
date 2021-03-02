package com.copy.reddit.dao;

import com.copy.reddit.model.*;
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
    public static class AnswerLikes {
        public int countLikes;
        public boolean hasLike;
    }

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

        Integer postId = (Integer) postKeyHolder.getKeyList().get(0).get("id");

        ArrayList<Integer> tagsId = new ArrayList<>();

        for(Tag tag: post.getTagList()) {
            tagsId.add(saveTag(tag));
        }

        for (Integer tagId: tagsId) {
            saveTagAndPost(tagId, postId);
        }

        for (Image image: post.getImages()) {
            saveImage(image, postId);
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

    public void saveImage(Image image, Integer postId) {
        String SQL_INSERT = "INSERT INTO \"image\" (postid, src) VALUES (?, ?)";
        jdbcTemplate.update(SQL_INSERT, postId, image.getSrc());
    }

    public boolean update(String text, int id) {
        return jdbcTemplate.update("UPDATE post SET text=? WHERE id=?",
                text, id) > 0;
    }

    public boolean delete(int id) {
        return jdbcTemplate.update("DELETE FROM post WHERE id=?", id) > 0;
    }

    public List<Post> findByTag(String tagName, Integer userId) {
        List<Post> posts = jdbcTemplate.query("SELECT post.id, post.text, post.userid, post.time FROM tag JOIN tagandpost ON tag.id = tagandpost.tagid JOIN post ON  post.id = tagandpost.postid where tag.name=?", new BeanPropertyRowMapper<>(Post.class), tagName);
        return addAdditionalInformationToPosts(posts, userId);
    }

    public List<Post> findAll(Integer userId) {
        List<Post> posts = jdbcTemplate.query("SELECT * FROM post",  new BeanPropertyRowMapper<>(Post.class));
        return addAdditionalInformationToPosts(posts, userId);
    }

    public List<Post> addAdditionalInformationToPosts(List<Post> posts, Integer userId) {
        for (Post post : posts) {
            post.setTagList(getTags(post.getId()));
            post.setImages(getImages(post.getId()));
            post.setCountComments(getCountComments(post.getId()));

            AnswerLikes answerLikes = getLikes(post.getId(), userId);
            post.setCountLikes(answerLikes.countLikes);
            post.setHasLike(answerLikes.hasLike);
        }

        return posts;
    }

    public List<Image> getImages(Integer postId) {
        String SQL_SELECT = "SELECT * FROM image WHERE postid=?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Image.class), postId);
    }

    public List<Tag> getTags(int postId) {
        return jdbcTemplate.query("SELECT tag.id, tag.name FROM post JOIN tagandpost ON post.id = tagandpost.postid JOIN tag ON tag.id = tagandpost.tagid WHERE post.id=?", new BeanPropertyRowMapper<>(Tag.class), postId);
    }

    public void createLike(int userId, int postId) {
        try {
            String SQL_INSERT = "INSERT INTO \"Like\" (userid, postid) values(?, ?)";
            jdbcTemplate.update(SQL_INSERT, userId, postId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteLike(int userId, int postId) {
        try {
            String SQL_DELETE = "DELETE FROM \"Like\" WHERE userid = ? AND postid = ?";
            jdbcTemplate.update(SQL_DELETE, userId, postId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public AnswerLikes getLikes(int postId, Integer userId) {
        String SQL_SELECT = "SELECT userid FROM \"Like\" WHERE postid=?";
        List<Like> likes = jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Like.class), postId);

        AnswerLikes answerLikes = new AnswerLikes();
        answerLikes.countLikes = likes.size();

        if (userId == null) {
            return answerLikes;
        }

        for(Like like: likes) {
            if (like.getUserId().equals(userId)) {
                answerLikes.hasLike = true;
                break;
            }
        }

        return answerLikes;
    }

    public Integer getCountComments(int postId) {
        String SQL_SELECT = "SELECT id FROM comment WHERE postid = ?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Comment.class), postId).size();
    }
}
