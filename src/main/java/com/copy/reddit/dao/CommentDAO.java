package com.copy.reddit.dao;

import com.copy.reddit.model.Comment;
import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class CommentDAO {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CommentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Получение комментариев к посту из баззы данных по его id
     * @param postId id поста
     * @return Список комментариев
     */
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

    /**
     * Получение ответов к комментарию из базы данных по id комментария
     * @param headCommentId id комментария
     * @return Список ответов к комментарию
     */
    public List<Comment> getAnswersByCommentId(Integer headCommentId) {
        String SQL_SELECT = "SELECT * FROM comment WHERE headcommentid = ?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Comment.class), headCommentId);
    }

    /**
     * Добавление комментария в базу данных здесь был Данил
     * @param comment Комментарий со всей информацией о нём
     */
    public Comment createComment(Comment comment) {
        String SQL_INSERT = "INSERT INTO comment (text, authorid, postid, headcommentid) VALUES (?, ?, ?, ?)";

        KeyHolder key = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, comment.getText());
                    ps.setInt(2, comment.getAuthorId());
                    ps.setInt(3, comment.getPostId());
                    ps.setInt(4, comment.getHeadCommentId());
                    return ps;
                },
                key);

        comment.setId((int) key.getKeyList().get(0).get("id"));

        return comment;
    }
}
