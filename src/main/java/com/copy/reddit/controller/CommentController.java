package com.copy.reddit.controller;

import com.copy.reddit.model.Comment;
import com.copy.reddit.service.CommentService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CommentController {
    private final CommentService commentService;
    private final SimpMessagingTemplate messagingTemplate;

    public CommentController(CommentService commentService, SimpMessagingTemplate messagingTemplate) {
        this.commentService = commentService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/comments")
    public void saveComment(@Payload Comment comment) {
        commentService.createComment(comment);
        messagingTemplate.convertAndSendToUser(
                comment.getPostId().toString(),
                "/comments",
                comment
        );
    }
}
