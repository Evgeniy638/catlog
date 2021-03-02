package com.copy.reddit.controller;

import com.copy.reddit.model.Post;
import com.copy.reddit.service.PostServiceImpl;
import com.copy.reddit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
public class PostController {
    private final PostServiceImpl postServiceImpl;
    private final UserService userService;

    @Autowired
    public PostController(PostServiceImpl postServiceImpl, UserService userService) {
        this.postServiceImpl = postServiceImpl;
        this.userService = userService;
    }

    @PostMapping(value = "/posts")
    public ResponseEntity<?> create(@RequestHeader("Authorization") String authorization, @RequestBody Post post) throws UnsupportedEncodingException {
        post.setUserId(userService.getUserByAuthorization(authorization).getId());
        post.setCountLikes(0);
        postServiceImpl.create(post);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

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

    @DeleteMapping(value = "/posts/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = postServiceImpl.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @PutMapping(value = "/posts/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody String text) {
        final boolean updated = postServiceImpl.update(text, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

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

    @PostMapping(value = "posts/likes/{postId}")
    public ResponseEntity<Integer> createLike(
            @RequestHeader("Authorization") String authorization,
            @PathVariable(name = "postId") int postId
    ) throws UnsupportedEncodingException {
        int userId = userService.getUserByAuthorization(authorization).getId();
        int countId = postServiceImpl.createLike(userId, postId);
        return new ResponseEntity<>(countId, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "posts/likes/{postId}")
    public ResponseEntity<Integer> deleteLike(
            @RequestHeader("Authorization") String authorization,
            @PathVariable(name = "postId") int postId
    ) throws UnsupportedEncodingException {
        int userId = userService.getUserByAuthorization(authorization).getId();
        int countId = postServiceImpl.deleteLike(userId, postId);
        return new ResponseEntity<>(countId, HttpStatus.OK);
    }

    @GetMapping(value = "posts/comments/{commentId}")
}
