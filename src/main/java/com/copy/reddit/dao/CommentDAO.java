package com.copy.reddit.dao;

import com.copy.reddit.model.Comment;
import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CommentDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CommentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Comment> getCommentsByPostId(Integer postId) {
        String SQL_SELECT = "SELECT * FROM comment WHERE postid = ? AND headcommentid IS NULL";
        List<Comment> comments = jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Comment.class), postId);

        for (Comment c:comments) {
            String SQL = "SELECT id FROM comment WHERE \"headcommentid\" = ? LIMIT 1";
            int countAnswers = jdbcTemplate.query(SQL, new BeanPropertyRowMapper<>(Comment.class), c.getId()).size();
            c.setHasAnswers(countAnswers > 0);
        }

        return comments;
    }

    public List<Comment> getAnswersByCommentId(Integer headCommentId) {
        String SQL_SELECT = "SELECT * FROM comment WHERE headcommentid = ?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Comment.class), headCommentId);
    }

    public void createComment(Comment comment) {
        String SQL_INSERT = "INSERT INTO comment (text, authorid, postid, headcommentid) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(SQL_INSERT, comment.getText(), comment.getAuthorId(), comment.getPostId(), comment.getHeadCommentId());
    }
}
