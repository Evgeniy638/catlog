package com.copy.reddit.controller;

import com.copy.reddit.dto.InfoAboutCommentsAndLikesDTO;
import com.copy.reddit.model.Image;
import com.copy.reddit.service.PostServiceImpl;
import com.copy.reddit.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
public class PostAdditionalInfoController {
    private final PostServiceImpl postService;
    private final UserService userService;

    public PostAdditionalInfoController(PostServiceImpl postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @GetMapping("/posts/images/{postId}")
    public ResponseEntity<List<Image>> getImages(@PathVariable("postId") Integer postId) {
        return new ResponseEntity<>(postService.getImage(postId), HttpStatus.OK);
    }

    @GetMapping("/posts/info_about_comments_and_likes/{postId}")
    public ResponseEntity<InfoAboutCommentsAndLikesDTO> getInfoAboutCommentsAndLikes(
            @PathVariable("postId") Integer postId,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Integer userId = null;

        if (authorization != null && !authorization.equals("")) {
            try {
                userId = userService.getUserByAuthorization(authorization).getId();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return new ResponseEntity<>(postService.getInfoAboutCommentsAndLikes(postId, userId), HttpStatus.OK);
    }
}
