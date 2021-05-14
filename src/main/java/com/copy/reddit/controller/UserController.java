package com.copy.reddit.controller;

import com.copy.reddit.dto.LoginDTO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.User;
import com.copy.reddit.service.DetailsService;
import com.copy.reddit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
public class UserController {
    private final UserService userService;
    private final DetailsService detailsService;

    @Autowired
    public UserController(UserService userService, DetailsService detailsService) {
        this.userService = userService;
        this.detailsService = detailsService;
    }

    /**
     * регистрирует пользователя
     * @param userDTO принимает nickname и password
     * @return возвращает authorization и nickname или HttpStatus.BAD_REQUEST, если nickname уже есть
     */
    @PostMapping(value = "/users/registration")
    public ResponseEntity<LoginDTO> registration(@RequestBody UserDTO userDTO) {
        if (!userService.saveUser(userDTO)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        LoginDTO loginDTO = new LoginDTO(
                userService.codeBase64(userDTO.getNickname(), userDTO.getPassword()),
                userDTO.getNickname());

        return new ResponseEntity<>(loginDTO, HttpStatus.OK);
    }

    /**
     * логинит пользователя
     * @param userDTO принимает nickname и password
     * @return возвращает authorization и nickname или HttpStatus.UNAUTHORIZED, если nickname или пароль неправильный
     */
    @PostMapping(value = "/users/my_login")
    public ResponseEntity<LoginDTO> login(@RequestBody UserDTO userDTO){
        PasswordEncoder encoder = User.PASSWORD_ENCODER;

        UserDetails user = detailsService.loadUserByUsername(userDTO.getNickname());

        if (user == null || !encoder.matches(userDTO.getPassword(), user.getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        LoginDTO loginDTO = new LoginDTO(
                userService.codeBase64(userDTO.getNickname(), userDTO.getPassword()),
                userDTO.getNickname());

        return new ResponseEntity<>(loginDTO, HttpStatus.OK);
    }

    /**
     * по токену для авторизации возвращает никнейм пользователя
     * @param authorization токен для авторизации
     * @return никнеём пользователя, которому соответствует authorization
     */
    @GetMapping(value = "users/nickname")
    public ResponseEntity<String> getNickname(@RequestHeader("Authorization") String authorization) throws UnsupportedEncodingException {
        return new ResponseEntity<>(userService.getNameByAuthorization(authorization), HttpStatus.OK);
    }

    @GetMapping(value = "/users/avatar/{nickname}")
    public ResponseEntity<String> getImageByNickname(@PathVariable("nickname") String nickname) {
        return new ResponseEntity<>(userService.getAvatarImg(nickname), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/posts/count")
    public ResponseEntity<Integer> getCountPosts(@PathVariable("nickname") String nickname) {
        return new ResponseEntity<>(userService.getCountPosts(nickname), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/posts/likes/count")
    public ResponseEntity<Integer> getCountLikes(@PathVariable("nickname") String nickname) {
        return new ResponseEntity<>(userService.getCountLikes(nickname), HttpStatus.OK);
    }

    @PostMapping(value = "/subscription/{following}")
    public ResponseEntity<Boolean> subscribe(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String following
    ) {
        String nickname = null;
        try {
            nickname = userService.getNameByAuthorization(authorization);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.subscribe(nickname, following);
        return new ResponseEntity<>(userService.isSubscribe(nickname, following),HttpStatus.OK);
    }

    @DeleteMapping(value = "/subscription/{following}")
    public ResponseEntity<Boolean> unsubscribe(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String following
    ) {
        String nickname = null;
        try {
            nickname = userService.getNameByAuthorization(authorization);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        userService.unsubscribe(nickname, following);
        return new ResponseEntity<>(userService.isSubscribe(nickname, following), HttpStatus.OK);
    }

    @GetMapping(value = "/subscription/{following}")
    public ResponseEntity<Boolean> isSubscribe(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String following
    ) {
        String nickname = null;
        try {
            nickname = userService.getNameByAuthorization(authorization);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(userService.isSubscribe(nickname, following), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/followers/count")
    public ResponseEntity<Integer> getCountFollowers(@PathVariable String nickname) {
        return new ResponseEntity<>(userService.getCountFollowers(nickname), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/followings/count")
    public ResponseEntity<Integer> getCountFollowings(@PathVariable String nickname) {
        return new ResponseEntity<>(userService.getCountFollowings(nickname), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/followers")
    public ResponseEntity<List<String>> getAllFollowers(@PathVariable String nickname) {
        return new ResponseEntity<>(userService.getAllFollowers(nickname), HttpStatus.OK);
    }

    @GetMapping(value = "/users/{nickname}/followings")
    public ResponseEntity<List<String>> getAllFollowings(@PathVariable String nickname) {
        return new ResponseEntity<>(userService.getAllFollowings(nickname), HttpStatus.OK);
    }
}
