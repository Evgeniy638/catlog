package com.copy.reddit.service;

import com.copy.reddit.dao.UserDAO;
import com.copy.reddit.dto.UserDTO;
import com.copy.reddit.model.Role;
import com.copy.reddit.model.User;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
//import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    private final UserDAO userDAO;

    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    /**
     * Сохраняет пользователя
     * @param userDTO экземпляр класса UserDTO, в котором должны быть password и nickname
     * @return true если сохранился, иначе false
     */
    public boolean saveUser(UserDTO userDTO) {
        User user = new User(userDTO.getNickname(), userDTO.getPassword(), userDTO.getAvatar());
        return userDAO.save(user);
    }

    /**
     * переводит имя и пароль пользователя в кодировку Base64
     * @param nickname имя пользователя
     * @param password его пароль
     * @return токен для авторизации (authorization)
     */
    public String codeBase64(String nickname, String password) {
        String auth = nickname + ":" + password;
        byte[] encodedAuth = Base64.encodeBase64(
                auth.getBytes(Charset.forName("US-ASCII")) );
        return "Basic " + new String( encodedAuth );
    }

    /**
     * возращает имя пользователя закодированное в authorization
     * @param authorization токен для авторизации
     * @return имя пользователя
     */
    public String getNameByAuthorization(String authorization) throws UnsupportedEncodingException {
        String code = authorization.replace("Basic ", "");
        return new String(Base64.decodeBase64(code), "US-ASCII").split(":")[0];
    }

    /**
     * возращает объект класса User на основе имени пользователя закодированного в authorization
     * @param authorization токен для авторизации
     * @return экзмепляр класса User
     */
    public User getUserByAuthorization(String authorization) throws UnsupportedEncodingException {
        return userDAO.findByUsername(getNameByAuthorization(authorization));
    }

    public String getAvatarImg(String nickname) {
        return userDAO.getAvatarImg(nickname);
    }

    public Integer getCountPosts(String nickname) {
        return userDAO.getCountPosts(nickname);
    }

    public Integer getCountLikes(String nickname) {
        return userDAO.getCountLikes(nickname);
    }

    public void subscribe(String nickname, String following) {
        userDAO.subscribe(nickname, following);
    }

    public void unsubscribe(String nickname, String following) {
        userDAO.unsubscribe(nickname, following);
    }

    public boolean isSubscribe(String nickname, String following) {
        return userDAO.isSubscribe(nickname, following);
    }

    public Integer getCountFollowers(String nickname) {
        return userDAO.getCountFollowers(nickname);
    }

    public Integer getCountFollowings(String nickname) {
        return userDAO.getCountFollowings(nickname);
    }

    public List<String> getAllFollowers(String nickname) {
        return userDAO.getAllFollowers(nickname);
    }

    public List<String> getAllFollowings(String nickname) {
        return userDAO.getAllFollowings(nickname);
    }
}
