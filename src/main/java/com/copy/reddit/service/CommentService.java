package com.copy.reddit.service;

import com.copy.reddit.dao.CommentDAO;
import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentDAO commentDAO;
    private final PostDAO postDAO;

    @Autowired
    public CommentService(CommentDAO commentDAO, PostDAO postDAO) {
        this.commentDAO = commentDAO;
        this.postDAO = postDAO;
    }


    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentDAO.getCommentsByPostId(postId);
    }

    public List<Comment> getAnswersByCommentId(Integer headCommentId) {
        return commentDAO.getAnswersByCommentId(headCommentId);
    }

    public int createComment(Comment comment) {
        commentDAO.createComment(comment);
        return postDAO.getCountComments(comment.getPostId());
    }
}
