package com.copy.reddit.service;

import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostDAO postDAO;

    @Autowired
    public PostServiceImpl(PostDAO postDAO) {
        this.postDAO = postDAO;
    }

    @Override
    public void create(Post post) {
        postDAO.save(post);
    }

    @Override
    public boolean update(String text, int id) {
        return postDAO.update(text, id);
    }

    @Override
    public boolean delete(int id) {
        return postDAO.delete(id);
    }

    @Override
    public List<Post> findByTag(String tagName, Integer userId) {
        return postDAO.findByTag(tagName, userId);
    }

    @Override
    public List<Post> findAll(Integer userId) {
        return postDAO.findAll(userId);
    }

    @Override
    public int createLike(int userId, int postId) {
        postDAO.createLike(userId, postId);
        return postDAO.getLikes(postId, userId).countLikes;
    }

    @Override
    public int deleteLike(int userId, int postId) {
        postDAO.deleteLike(userId, postId);
        return postDAO.getLikes(postId, userId).countLikes;
    }
}
