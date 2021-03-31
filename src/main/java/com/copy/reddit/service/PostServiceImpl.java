package com.copy.reddit.service;

import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.model.Image;
import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PostServiceImpl implements PostService {

    private final PostDAO postDAO;
    private final FileHelper fileHelper;

    @Autowired
    public PostServiceImpl(PostDAO postDAO, FileHelper fileHelper) {
        this.postDAO = postDAO;
        this.fileHelper = fileHelper;
    }

    @Override
    public void create(Post post, String authorization) {
        for (Image image: post.getImages()) {
            String imageName = UUID.randomUUID().toString() +
                    authorization.replace(" ", "_") + image.getName();
            String src = fileHelper.saveDataUrlToFile(image.getDataUrl(), imageName);
            image.setSrc(src);
        }

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
