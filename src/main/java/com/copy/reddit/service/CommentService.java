package com.copy.reddit.service;

import com.copy.reddit.dao.CommentDAO;
import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.HeadCommentDTO;
import com.copy.reddit.dto.RepliesDTO;
import com.copy.reddit.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {
    private final CommentDAO commentDAO;
    private final PostDAO postDAO;
    private final UserDAO userDAO;

    @Autowired
    public CommentService(CommentDAO commentDAO, PostDAO postDAO, UserDAO userDAO) {
        this.commentDAO = commentDAO;
        this.postDAO = postDAO;
        this.userDAO = userDAO;
    }


    /**
     * Получение комментариев по id поста
     * @param postId id поста
     * @return Список комментариев к посту
     */
    public List<HeadCommentDTO> getCommentsByPostId(Integer postId) {
        List<HeadCommentDTO> headCommentDTOS = new ArrayList<>();

        List<Comment> comments = commentDAO.getCommentsByPostId(postId);

        for(Comment comment: comments) {
            List<RepliesDTO> repliesDTOS = new ArrayList<>();

            if (comment.getHasAnswers()) {
                List<Comment> listRepliesComments = commentDAO.getAnswersByCommentId(comment.getId());

                for (Comment repliesComment: listRepliesComments) {
                    RepliesDTO repliesDTO = new RepliesDTO(
                            repliesComment.getId(),
                            repliesComment.getText(),
                            repliesComment.getAuthorNickname(),
                            repliesComment.getPostId(),
                            repliesComment.getHeadCommentId()
                    );

                    repliesDTOS.add(repliesDTO);
                }
            }

            HeadCommentDTO headComment = new HeadCommentDTO(
                    comment.getId(),
                    comment.getText(),
                    comment.getAuthorNickname(),
                    comment.getPostId(),
                    comment.getHasAnswers(),
                    repliesDTOS
            );

            headCommentDTOS.add(headComment);
        }

        return headCommentDTOS;
    }

    /**
     * Получение ответов на данный комментарий
     * @param headCommentId id комментария
     * @return Список ответов на комментарий
     */
    public List<Comment> getAnswersByCommentId(Integer headCommentId) {
        return commentDAO.getAnswersByCommentId(headCommentId);
    }

    /**
     * Добавление комментария
     * @param comment Комментарий со всей информацией
     * @return Количество комментарией под постом с данным
     */
    public int createComment(Comment comment) {
        commentDAO.createComment(comment);
        return postDAO.getCountComments(comment.getPostId());
    }
}
