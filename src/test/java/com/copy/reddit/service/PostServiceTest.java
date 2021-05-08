package com.copy.reddit.service;

import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.dto.InfoAboutCommentsAndLikesDTO;
import com.copy.reddit.dto.LikeByIdDTO;
import com.copy.reddit.model.Image;
import com.copy.reddit.model.Post;
import com.copy.reddit.model.Tag;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class PostServiceTest {
    @InjectMocks
    PostServiceImpl postService;

    @Mock
    PostDAO postDAO;

    @Test
    public void create() {
        Post newPost = new Post();
        newPost.setText("новый пост");

        Post resultPost = new Post();
        resultPost.setText(newPost.getText());
        resultPost.setId(1);

        Mockito.when(postDAO.save(newPost)).thenReturn(resultPost);



        Assertions.assertEquals(resultPost, postService.create(newPost, ""));
    }

    @Test
    public void findByNickname() {
        String nick = "nick";

        Post post1 = new Post();
        post1.setId(1);
        post1.setAuthorNickname(nick);

        Post post2 = new Post();
        post2.setId(2);
        post2.setAuthorNickname(nick);

        Mockito
                .when(postDAO.findByNickname(nick, 1, Integer.MAX_VALUE))
                .thenReturn(List.of(post2, post1));

        List<Post> posts = postService.findByNickname(nick, 1, Integer.MAX_VALUE);

        Assertions.assertEquals(2, posts.size());
        Assertions.assertEquals(post2, posts.get(0));
        Assertions.assertEquals(post1, posts.get(1));
    }

    @Test
    public void findByTags() {
        Tag tag = new Tag();
        tag.setName("test");

        List<Tag> tagList = new ArrayList<>();
        tagList.add(tag);

        Post post1 = new Post();
        post1.setId(1);
        post1.setTagList(tagList);

        Post post2 = new Post();
        post2.setId(2);
        post1.setTagList(tagList);

        List<String> tagNames = List.of(tagList.get(0).getName());

        Mockito
                .when(postDAO.findByTag(tagNames, 1, Integer.MAX_VALUE))
                .thenReturn(List.of(post2, post1));

        List<Post> posts = postService.findByTags(tagNames, 1, Integer.MAX_VALUE);

        Assertions.assertEquals(2, posts.size());
        Assertions.assertEquals(post2, posts.get(0));
        Assertions.assertEquals(post1, posts.get(1));
    }

    @Test
    public void findAll() {
        Post post1 = new Post();
        post1.setId(1);

        Post post2 = new Post();
        post2.setId(2);

        Mockito
                .when(postDAO.findAll(1, Integer.MAX_VALUE))
                .thenReturn(List.of(post2, post1));

        List<Post> posts = postService.findAll(1, Integer.MAX_VALUE);

        Assertions.assertEquals(2, posts.size());
        Assertions.assertEquals(post2, posts.get(0));
        Assertions.assertEquals(post1, posts.get(1));
    }

    @Test
    public void createLike() {
        int postId = 1;
        int userId = 1;

        PostDAO.AnswerLikes answerLikes = new PostDAO.AnswerLikes();
        answerLikes.countLikes = 1;

        Mockito
                .when(postDAO.getLikes(postId, userId))
                .thenReturn(answerLikes);

        Assertions.assertEquals(answerLikes.countLikes, postService.createLike(userId, postId));
    }

    @Test
    public void deleteLike() {
        int postId = 1;
        int userId = 1;

        PostDAO.AnswerLikes answerLikes = new PostDAO.AnswerLikes();
        answerLikes.countLikes = 0;

        Mockito
                .when(postDAO.getLikes(postId, userId))
                .thenReturn(answerLikes);

        Assertions.assertEquals(answerLikes.countLikes, postService.deleteLike(userId, postId));
    }

    @Test
    public void getLikesInfo() {
        List<Integer> postsIds = List.of(1, 2);
        int userId = 1;

        PostDAO.AnswerLikes answerLikes1 = new PostDAO.AnswerLikes();
        answerLikes1.hasLike = false;

        PostDAO.AnswerLikes answerLikes2 = new PostDAO.AnswerLikes();
        answerLikes2.hasLike = true;

        Mockito.when(postDAO.getLikes(postsIds.get(0), userId)).thenReturn(answerLikes1);
        Mockito.when(postDAO.getLikes(postsIds.get(1), userId)).thenReturn(answerLikes2);

        List<LikeByIdDTO> likesInfo = postService.getLikesInfo(postsIds, userId);

        Assertions.assertEquals(postsIds.size(), likesInfo.size());

        Assertions.assertEquals(postsIds.get(0), likesInfo.get(0).getPostId());
        Assertions.assertEquals(answerLikes1.hasLike, likesInfo.get(0).isHasLike());


        Assertions.assertEquals(postsIds.get(1), likesInfo.get(1).getPostId());
        Assertions.assertEquals(answerLikes2.hasLike, likesInfo.get(1).isHasLike());
    }

    @Test
    public void findMatchesByTags() {
        List<String> tagsNames = List.of("ко");

        List<String> expected = List.of("кот", "котики");

        Mockito.when(postDAO.findMatchesByTags(tagsNames)).thenReturn(expected);

        Assertions.assertEquals(expected, postService.findMatchesByTags(tagsNames));
    }

    @Test
    public void getImage() {
        int postId = 1;

        Image image1 = new Image();
        image1.setId(1);

        Image image2 = new Image();
        image2.setId(1);

        Mockito.when(postDAO.getImages(postId)).thenReturn(List.of(image1, image2));

        List<Image> res = postService.getImage(postId);

        Assertions.assertEquals(2, res.size());
        Assertions.assertEquals(image1.getId(), res.get(0).getId());
        Assertions.assertEquals(image2.getId(), res.get(1).getId());
    }

    @Test
    public void getInfoAboutCommentsAndLikes() {
        Integer postId = 1;
        Integer userId = 1;

        PostDAO.AnswerLikes answerLikes = new PostDAO.AnswerLikes();
        answerLikes.countLikes = 1;
        answerLikes.hasLike = true;

        int countComments = 3;

        Mockito
                .when(postDAO.getLikes(postId, userId))
                .thenReturn(answerLikes);

        Mockito
                .when(postDAO.getCountComments(postId))
                .thenReturn(countComments);

        InfoAboutCommentsAndLikesDTO result = postService.getInfoAboutCommentsAndLikes(postId, userId);

        Assertions.assertEquals(countComments, result.getCountComments());
        Assertions.assertEquals(postId, result.getPostId());
        Assertions.assertEquals(answerLikes.hasLike, result.isHasLike());
        Assertions.assertEquals(answerLikes.countLikes, result.getCountLikes());
    }
}
