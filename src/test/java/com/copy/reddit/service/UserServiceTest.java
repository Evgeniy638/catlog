package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.UnsupportedEncodingException;

@SpringBootTest
public class UserServiceTest {
    @InjectMocks
    UserService userService;

    @Mock
    UserDAO userDAO;

    @Test
    public void getUserByAuthorization() {
        String nickname = "nickname";
        String password = "passssss";
        String auth = userService.codeBase64(nickname, password);

        User user = new User();
        user.setNickname(nickname);

        Mockito.when(userDAO.findByUsername(user.getNickname())).thenReturn(user);

        try {
            Assertions.assertEquals(user, userService.getUserByAuthorization(auth));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void getAvatarImg() {
        String nickname = "nickname";
        String img = "picture";

        Mockito.when(userDAO.getAvatarImg(nickname)).thenReturn(img);

        Assertions.assertEquals(img, userService.getAvatarImg(nickname));
    }

    @Test
    public void getCountPosts() {
        String nickname = "nickname";
        int countPosts = 5;

        Mockito.when(userDAO.getCountPosts(nickname)).thenReturn(countPosts);

        Assertions.assertEquals(countPosts, userService.getCountPosts(nickname));
    }

    @Test
    public void getCountLikes() {
        String nickname = "nickname";
        int countLikes = 5;

        Mockito.when(userDAO.getCountLikes(nickname)).thenReturn(countLikes);

        Assertions.assertEquals(countLikes, userService.getCountLikes(nickname));
    }
}
