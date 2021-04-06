package com.copy.reddit.service;

import com.copy.reddit.dto.LikeByIdDTO;
import com.copy.reddit.model.Post;

import java.util.List;

public interface PostService {
    void create(Post post, String authorization);
    boolean update(String text, int id);
    boolean delete(int id);
    List<Post> findByTag(String tagName, Integer userId);
    List<Post> findAll(Integer userId);
    int createLike(int userId, int postId);
    int deleteLike(int userId, int postId);
    List<LikeByIdDTO> getLikesInfo(List<Integer> postsIds, int userId);
}
