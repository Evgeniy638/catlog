package com.copy.reddit.controller;

import com.copy.reddit.dto.LikeByIdDTO;
import com.copy.reddit.model.Comment;
import com.copy.reddit.model.Post;
import com.copy.reddit.model.User;
import com.copy.reddit.service.CommentService;
import com.copy.reddit.service.PostServiceImpl;
import com.copy.reddit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
public class PostController {
    private final PostServiceImpl postServiceImpl;
    private final UserService userService;
    private final CommentService commentService;

    @Autowired
    public PostController(PostServiceImpl postServiceImpl, UserService userService, CommentService commentService) {
        this.postServiceImpl = postServiceImpl;
        this.userService = userService;
        this.commentService = commentService;
    }

    /**
     * Создание поста
     * @param authorization Токен для авторизации
     * @param post Токен поста для его добавления
     * @return Статус запроса
     */
    @PostMapping(value = "/posts")
    public ResponseEntity<Post> create(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Post post
    ) throws IOException {
        User user = userService.getUserByAuthorization(authorization);
        post.setUserId(user.getId());
        post.setCountLikes(0);
        post.setCountComments(0);

        Post newPost = postServiceImpl.create(post, authorization);
        newPost.setAuthorNickname(user.getNickname());
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    /**
     * Поиск постов по тегу
     * @param tagName Имя тега
     * @param authorization Необязательный токен для авторизации
     * @return Статус о выполнении запроса и посты с данным тегом, если они есть
     */
    @GetMapping(value = "/posts/{tagName}")
    public ResponseEntity<?> findByTag(
            @PathVariable(name = "tagName") String tagName,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) throws UnsupportedEncodingException {
        Integer userId = null;

        if (authorization != null) {
            userId = userService.getUserByAuthorization(authorization).getId();
        }

        final List<Post> posts = postServiceImpl.findByTag(tagName, userId);
        System.out.println(tagName + " " + posts);
        return posts != null
                ? new ResponseEntity<>(posts, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Удаления поста по его id
     * @param id id поста
     * @return Стату выполнения запроса
     */
    @DeleteMapping(value = "/posts/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = postServiceImpl.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    /**
     * Обновление текста поста
     * @param id id поста для изменения
     * @param text Новый текст поста
     * @return Статус о выполнении запроса
     */
    @PutMapping(value = "/posts/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody String text) {
        final boolean updated = postServiceImpl.update(text, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    /**
     * Вывод всех постов
     * @param authorization Необязательный токен для авторизации
     * @return Статус выполнения запроса и все посты, если они есть
     */
    @GetMapping(value = "/posts")
    public ResponseEntity<List<Post>> read(
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) throws UnsupportedEncodingException {
        Integer userId = null;

        if (authorization != null) {
            userId = userService.getUserByAuthorization(authorization).getId();
        }

        final List<Post> posts = postServiceImpl.findAll(userId);

        return posts != null &&  !posts.isEmpty()
                ? new ResponseEntity<>(posts, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Добавляет лайк на пост, если он ещё не поставлен
     * @param authorization Токен для авторизации
     * @param postId Id поста
     * @return Количество лайков на посте
     */
    @PostMapping(value = "posts/likes/{postId}")
    public ResponseEntity<Integer> createLike(
            @RequestHeader("Authorization") String authorization,
            @PathVariable(name = "postId") int postId
    ) throws UnsupportedEncodingException {
        int userId = userService.getUserByAuthorization(authorization).getId();
        int countId = postServiceImpl.createLike(userId, postId);
        return new ResponseEntity<>(countId, HttpStatus.CREATED);
    }

    /**
     * Убирает лайк с поста, если он поставлен
     * @param authorization Токен для авторизации
     * @param postId id поста
     * @return Статус выполнения запроса и количество лайков поста
     * @throws UnsupportedEncodingException
     */
    @DeleteMapping(value = "posts/likes/{postId}")
    public ResponseEntity<Integer> deleteLike(
            @RequestHeader("Authorization") String authorization,
            @PathVariable(name = "postId") int postId
    ) throws UnsupportedEncodingException {
        int userId = userService.getUserByAuthorization(authorization).getId();
        int countId = postServiceImpl.deleteLike(userId, postId);
        return new ResponseEntity<>(countId, HttpStatus.OK);
    }

    /**
     * Получение комментариев поста по его id
     * @param postId id поста
     * @return Статут выполнения запроса и комментарии к посту
     */
    @GetMapping(value = "posts/comments/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(
            @PathVariable(name = "postId") Integer postId
    ) {
        return new ResponseEntity<>(commentService.getCommentsByPostId(postId), HttpStatus.OK);
    }

    /**
     * Получение ответов к комментарию по его id
     * @param commentId id комментария
     * @return Статус выполнения запроса и ответы к комментарию
     */
    @GetMapping(value = "posts/comments/answers/{commentId}")
    public ResponseEntity<List<Comment>> getAnswersByCommentId(
            @PathVariable(name = "commentId") Integer commentId
    ) {
        return new ResponseEntity<>(commentService.getAnswersByCommentId(commentId), HttpStatus.OK);
    }

    /**
     * Добавление комментария
     * @param authorization Токен для авторизации
     * @param comment Комментарий со всей информацией о нём
     * @return Статус выполнения запроса и количество комментариев к посту
     */
    @PostMapping(value = "posts/comments/create_comment")
    public ResponseEntity<Integer> createComment(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Comment comment
    ) throws UnsupportedEncodingException {
        comment.setHeadCommentId(null);
        comment.setAuthorId(userService.getUserByAuthorization(authorization).getId());
        Integer countComments = commentService.createComment(comment);
        return new ResponseEntity<>(countComments, HttpStatus.CREATED);
    }

    /**
     * Добавления ответа к комментарию
     * @param authorization Такен для авторизации
     * @param comment Ответ к комментарию в виде комментария со всем информацией о нём
     * @return Статус выполнения запроса и общее количество комментариев к посту
     * @throws UnsupportedEncodingException
     */
    @PostMapping(value = "posts/comments/create_answer")
    public ResponseEntity<Integer> createAnswers(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Comment comment
    ) throws UnsupportedEncodingException {
        comment.setAuthorId(userService.getUserByAuthorization(authorization).getId());
        Integer countComments = commentService.createComment(comment);
        return new ResponseEntity<>(countComments, HttpStatus.CREATED);
    }

    @PostMapping(value = "posts/likes/get_own")
    public ResponseEntity<List<LikeByIdDTO>> getLikesInfo(
            @RequestHeader("Authorization") String authorization, @RequestBody List<Integer> postsIds
    ) throws UnsupportedEncodingException {
        return new ResponseEntity<>(postServiceImpl.getLikesInfo(postsIds,
                userService.getUserByAuthorization(authorization).getId()), HttpStatus.OK);
    }
}
