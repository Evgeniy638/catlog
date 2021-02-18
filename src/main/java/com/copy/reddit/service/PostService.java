package com.copy.reddit.service;

import com.copy.reddit.model.Post;

import java.util.List;

public interface PostService {
    void create(Post post);
    boolean update(String text, int id);
    boolean delete(int id);
    List<Post> findByTag(String tagName);
    List<Post> findAll();
}
