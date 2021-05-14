package com.copy.reddit.controller;

import com.copy.reddit.dto.HeadCommentDTO;
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
import java.util.Arrays;
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
     * @param tagsNames Имя тега
     * @param authorization Необязательный токен для авторизации
     * @return Статус о выполнении запроса и посты с данным тегом, если они есть
     */
    @GetMapping(value = "/posts/tags/find/{tagsNames}")
    public ResponseEntity<?> findByTag(
            @RequestParam(name = "sinceId") Integer sinceId,
            @PathVariable(name = "tagsNames") String tagsNames,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) throws UnsupportedEncodingException {
        Integer userId = null;

        if (authorization != null) {
            userId = userService.getUserByAuthorization(authorization).getId();
        }

        if (sinceId < 0) {
            sinceId = Integer.MAX_VALUE;
        }

        List<String> listTags = Arrays.asList(tagsNames.split("\\+"));
        final List<Post> posts = postServiceImpl.findByTags(listTags, userId, sinceId);

        return posts != null
                ? new ResponseEntity<>(posts, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/posts/user/{nickname}/{sinceId}")
    public ResponseEntity<?> findByNickname(
            @PathVariable(name = "nickname") String nickname,
            @PathVariable(name = "sinceId") Integer sinceId,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) throws UnsupportedEncodingException {
        Integer userId = null;

        if (authorization != null) {
            userId = userService.getUserByAuthorization(authorization).getId();
        }

        if (sinceId < 0) {
            sinceId = Integer.MAX_VALUE;
        }

        final List<Post> posts = postServiceImpl.findByNickname(nickname, userId, sinceId);

        return posts != null
                ? new ResponseEntity<>(posts, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/posts/tags/matches/{tagsNames}")
    public ResponseEntity<?> findMatchesByTags(
            @PathVariable(name = "tagsNames", required = false) String tagsNames
    ) {
        List<String> foundTags = postServiceImpl.findMatchesByTags(Arrays.asList(tagsNames.split("\\+")));
        return new ResponseEntity<>(foundTags, HttpStatus.OK);
    }

    /**
     * Удаления поста по его id
     * @param id id поста
     * @return Стату выполнения запроса
     */
    @DeleteMapping(value = "/posts/delete/{id}")
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
    @GetMapping(value = "/posts/{sinceId}")
    public ResponseEntity<List<Post>> read(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable("sinceId") Integer sinceId
    ) throws UnsupportedEncodingException {
        Integer userId = null;

        if (authorization != null) {
            userId = userService.getUserByAuthorization(authorization).getId();
        }

        if (sinceId < 0) {
            sinceId = Integer.MAX_VALUE;
        }

        final List<Post> posts = postServiceImpl.findAll(userId, sinceId);

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
    public ResponseEntity<List<HeadCommentDTO>> getCommentsByPostId(
            @PathVariable(name = "postId") Integer postId
    ) {
        return new ResponseEntity<>(
                commentService.getCommentsByPostId(postId),
                HttpStatus.OK
        );
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

    @PostMapping(value = "posts/likes/get_own")
    public ResponseEntity<List<LikeByIdDTO>> getLikesInfo(
            @RequestHeader("Authorization") String authorization, @RequestBody List<Integer> postsIds
    ) throws UnsupportedEncodingException {
        return new ResponseEntity<>(postServiceImpl.getLikesInfo(postsIds,
                userService.getUserByAuthorization(authorization).getId()), HttpStatus.OK);
    }
}
