package com.copy.reddit.dao;

import com.copy.reddit.model.*;
import com.copy.reddit.row.mapper.BeanPropertyPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
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

    /**
     * Добавление поста в базу данных
     * @param post Пост
     */
    public Post save(Post post) {
        String POST_INSERT_SQL = "INSERT INTO Post (text, userid, time) values (?, ?, ?)";
        KeyHolder postKeyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(POST_INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, post.getText());
                    ps.setInt(2, post.getUserId());
                    ps.setTimestamp(3, new Timestamp(post.getTime()));
                    return ps;
                },
                postKeyHolder);

        Integer postId = (Integer) postKeyHolder.getKeyList().get(0).get("id");
        post.setId(postId);

        ArrayList<Integer> tagsId = new ArrayList<>();

        for(Tag tag: post.getTagList()) {
            tagsId.add(saveTag(tag));
        }

        for (Integer tagId: tagsId) {
            saveTagAndPost(tagId, postId);
        }

        List<Image> imageList = post.getImages();

        if (imageList != null) {
            for (Image image :imageList) {
                saveImage(image, postId);
            }
        }

        return post;
    }

    /**
     * Добавление связи между тегом и постом в базу данных
     * @param tagId id тега
     * @param postId id поста
     */
    public void saveTagAndPost(int tagId, int postId) {
        jdbcTemplate.update("INSERT INTO tagandpost (tagid, postid) VALUES (?, ?)", tagId, postId);
    }

    /**
     * Добавление тега в базу данных
     * @param tag Тег и вся информация о нём
     * @return Тег
     */
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

    /**
     * Добавление изображения поста в базу данных
     * @param image изображение
     * @param postId id поста, к которому привязано изображение
     */
    public void saveImage(Image image, Integer postId) {
        String SQL_INSERT = "INSERT INTO \"image\" (postid, src) VALUES (?, ?)";
        jdbcTemplate.update(SQL_INSERT, postId, image.getSrc());
    }

    /**
     * Обновление текста поста в базе данных
     * @param text Текст измененного поста
     * @param id id поста, который надо изменить
     * @return true, если проведено хотя бы одно изменение
     */
    public boolean update(String text, int id) {
        return jdbcTemplate.update("UPDATE post SET text=? WHERE id=?",
                text, id) > 0;
    }

    /**
     * Удаляет пост по его id
     * @param id id поста
     * @return true, если удален хотя бы один пост
     */
    public boolean delete(int id) {
        return jdbcTemplate.update("DELETE FROM post WHERE id=?", id) > 0;
    }

    /**
     * Поиск постов по тегу и пользователю
     * @param tagName Имя тега
     * @param userId id пользователя
     * @return Список постов, найденных по тегу
     */
    public List<Post> findByTag(String tagName, Integer userId) {
        String SQL_SELECT = "SELECT post.id, post.text, post.userid, post.time, \"User\".nickname FROM tag " +
                "JOIN tagandpost ON tag.id = tagandpost.tagid " +
                "JOIN post ON  post.id = tagandpost.postid " +
                "JOIN \"User\" on \"User\".id = post.userid " +
                "where tag.name LIKE ? " +
                "ORDER BY post.\"time\" DESC " +
                "LIMIT 1 OFFSET 1";
        List<Post> posts = jdbcTemplate.query(SQL_SELECT, new BeanPropertyPost(), "%" + tagName + "%");
        return addAdditionalInformationToPosts(posts, userId);
    }

    /**
     * Поиск всех постов
     * @param userId id пользователя
     * @return Список постов
     */
    public List<Post> findAll(Integer userId) {
        List<Post> posts = jdbcTemplate.query("SELECT post.id, post.text, post.userid, post.time, \"User\".nickname FROM post JOIN \"User\" on \"User\".id = post.userid ORDER BY post.\"time\" DESC LIMIT ALL OFFSET 0",  new BeanPropertyPost());
        return addAdditionalInformationToPosts(posts, userId);
    }

    /**
     * Добавление тегов, изображений, количество лайков и комментариев к посту
     * @param posts Список постов
     * @param userId Id пользователя
     * @return Список постов с добавленной дополнительной информацией
     */
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

    /**
     * Получение изображений, прикрепленных к посту по его id
     * @param postId id поста
     * @return Список изображений, прикрепленных к посту
     */
    public List<Image> getImages(Integer postId) {
        String SQL_SELECT = "SELECT * FROM image WHERE postid=?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Image.class), postId);
    }

    /**
     * Получение тегов, прикрепленных к посту по его id
     * @param postId id поста
     * @return Список тегов, прикрепленных к посту
     */
    public List<Tag> getTags(int postId) {
        return jdbcTemplate.query("SELECT tag.id, tag.name FROM post JOIN tagandpost ON post.id = tagandpost.postid JOIN tag ON tag.id = tagandpost.tagid WHERE post.id=?", new BeanPropertyRowMapper<>(Tag.class), postId);
    }

    /**
     * Добавление лайка пользователя к посту
     * @param userId id пользователя
     * @param postId id поста
     */
    public void createLike(int userId, int postId) {
        try {
            String SQL_INSERT = "INSERT INTO \"Like\" (userid, postid) values(?, ?)";
            jdbcTemplate.update(SQL_INSERT, userId, postId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Удаление лайка пользователя с поста
     * @param userId id пользователя
     * @param postId id поста
     */
    public void deleteLike(int userId, int postId) {
        try {
            String SQL_DELETE = "DELETE FROM \"Like\" WHERE userid = ? AND postid = ?";
            jdbcTemplate.update(SQL_DELETE, userId, postId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Получение количества лайков с поста и проверка, стоит ли лайк пользователя
     * @param userId id пользователя
     * @param postId id поста
     * @return Параметр количества лайков, проверяющий, стоит ли лайк пользователя
     */
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

    /**
     * Получение количества комментариев под постом
     * @param postId id поста
     * @return Количество комментариев
     */
    public Integer getCountComments(int postId) {
        String SQL_SELECT = "SELECT id FROM comment WHERE postid = ?";
        return jdbcTemplate.query(SQL_SELECT, new BeanPropertyRowMapper<>(Comment.class), postId).size();
    }
}
