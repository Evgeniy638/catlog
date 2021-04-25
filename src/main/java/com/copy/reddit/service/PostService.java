package com.copy.reddit.service;

import com.copy.reddit.dto.InfoAboutCommentsAndLikesDTO;
import com.copy.reddit.dto.LikeByIdDTO;
import com.copy.reddit.model.Image;
import com.copy.reddit.model.Post;

import java.util.List;

public interface PostService {
    Post create(Post post, String authorization);
    boolean update(String text, int id);
    boolean delete(int id);
    List<Post> findByTags(List<String> tagsNames, Integer userId);
    List<Post> findAll(Integer userId);
    int createLike(int userId, int postId);
    int deleteLike(int userId, int postId);
    List<LikeByIdDTO> getLikesInfo(List<Integer> postsIds, int userId);
    List<String> findMatchesByTags(List<String> tagsNames);
    List<Image> getImage(Integer postId);
    InfoAboutCommentsAndLikesDTO getInfoAboutCommentsAndLikes (Integer postId, Integer userId);
}
