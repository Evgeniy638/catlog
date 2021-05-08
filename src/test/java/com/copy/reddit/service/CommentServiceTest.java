package com.copy.reddit.service;

import com.copy.reddit.dao.CommentDAO;
import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.HeadCommentDTO;
import com.copy.reddit.dto.RepliesDTO;
import com.copy.reddit.model.Comment;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class CommentServiceTest {
    @InjectMocks
    CommentService commentService;

    @Mock
    PostDAO postDAO;

    @Mock
    UserDAO userDAO;

    @Mock
    CommentDAO commentDAO;

    @Test
    public void getCommentsByPostId() {
        int postId = 1;

        Comment comment1 = new Comment();
        comment1.setId(1);
        comment1.setHasAnswers(true);
        comment1.setPostId(postId);

        Comment comment2 = new Comment();
        comment2.setId(2);
        comment2.setPostId(postId);
        comment2.setHeadCommentId(1);

        Comment comment3 = new Comment();
        comment3.setId(3);
        comment3.setPostId(postId);
        comment3.setHeadCommentId(1);

        Mockito
                .when(commentDAO.getCommentsByPostId(comment1.getPostId()))
                .thenReturn(List.of(comment1));

        Mockito
                .when(commentDAO.getAnswersByCommentId(comment1.getPostId()))
                .thenReturn(List.of(comment2, comment3));

        List<HeadCommentDTO> result = commentService.getCommentsByPostId(comment1.getPostId());

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(comment1.getId(), result.get(0).getId());
        
        List<RepliesDTO> replies = result.get(0).getReplies();
        
        Assertions.assertEquals(2, replies.size());
        Assertions.assertEquals(comment2.getId(), replies.get(0).getId());
        Assertions.assertEquals(comment3.getId(), replies.get(1).getId());
    }

    @Test
    public void getAnswersByCommentId() {
        int postId = 1;
        int headId = 0;

        Comment comment1 = new Comment();
        comment1.setId(1);
        comment1.setPostId(postId);
        comment1.setHeadCommentId(headId);

        Comment comment2 = new Comment();
        comment2.setId(2);
        comment2.setPostId(postId);
        comment2.setHeadCommentId(headId);

        Mockito
                .when(commentDAO.getAnswersByCommentId(headId))
                .thenReturn(List.of(comment1, comment2));

        List<Comment> result = commentService.getAnswersByCommentId(headId);

        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals(comment1.getId(), result.get(0).getId());
        Assertions.assertEquals(comment2.getId(), result.get(1).getId());
    }

    @Test
    public void createComment() {
        Comment comment1 = new Comment();
        comment1.setId(1);
        comment1.setPostId(1);

        Mockito
                .when(postDAO.getCountComments(1))
                .thenReturn(1);

        Assertions.assertEquals(1, commentService.createComment(comment1));
    }
}
