package com.copy.reddit.service;

import com.copy.reddit.dao.PostDAO;
import com.copy.reddit.dto.InfoAboutCommentsAndLikesDTO;
import com.copy.reddit.dto.LikeByIdDTO;
import com.copy.reddit.model.Image;
import com.copy.reddit.model.Like;
import com.copy.reddit.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PostServiceImpl implements PostService {

    private final PostDAO postDAO;

    @Autowired
    public PostServiceImpl(PostDAO postDAO) {
        this.postDAO = postDAO;
    }

    /**
     * Создание поста
     * @param post Объект поста
     * @param authorization Токен для авторизации
     */
    @Override
    public Post create(Post post, String authorization) {
        return postDAO.save(post);
    }

    /**
     * Обновление текста поста
     * @param text новый тест поста
     * @param id id поста
     * @return true, если пост обновлен
     */
    @Override
    public boolean update(String text, int id) {
        return postDAO.update(text, id);
    }

    /**
     * Удаление поста
     * @param id id поста
     * @return true, если пост успешно удалён
     */
    @Override
    public boolean delete(int id) {
        return postDAO.delete(id);
    }

    @Override
    public List<Post> findByNickname(String nickname, Integer userId) {
        return postDAO.findByNickname(nickname, userId);
    }

    /**
     * Поиск по тегу
     * @param tagsNames имя тега
     * @param userId id пользователя
     * @return Список постов с данным тегом
     */
    @Override
    public List<Post> findByTags(List<String> tagsNames, Integer userId) {
        return postDAO.findByTag(tagsNames, userId);
    }

    /**
     * Возвращает все посты
     * @param userId id пользователя
     * @return Список постов
     */
    @Override
    public List<Post> findAll(Integer userId) {
        return postDAO.findAll(userId);
    }

    /**
     * Добавление лайка к посту
     * @param userId id пользователя
     * @param postId id поста
     * @return Количество лайков под данным постом
     */
    @Override
    public int createLike(int userId, int postId) {
        postDAO.createLike(userId, postId);
        return postDAO.getLikes(postId, userId).countLikes;
    }

    /**
     * Удаление лайка с поста
     * @param userId id пользователя
     * @param postId id поста
     * @return Количество лайков на посте
     */
    @Override
    public int deleteLike(int userId, int postId) {
        postDAO.deleteLike(userId, postId);
        return postDAO.getLikes(postId, userId).countLikes;
    }

    @Override
    public List<LikeByIdDTO> getLikesInfo(List<Integer> postsIds, int userId) {
        List<LikeByIdDTO> likesInfo = new ArrayList<>(postsIds.size());
        for(Integer p: postsIds)
        {
            likesInfo.add(new LikeByIdDTO(p, postDAO.getLikes(p, userId).hasLike));
        }
        return likesInfo;
    }

    @Override
    public List<String> findMatchesByTags(List<String> tagsNames) {
        return postDAO.findMatchesByTags(tagsNames);
    }

    @Override
    public List<Image> getImage(Integer postId) {
        return postDAO.getImages(postId);
    }

    @Override
    public InfoAboutCommentsAndLikesDTO getInfoAboutCommentsAndLikes(Integer postId, Integer userId) {
        PostDAO.AnswerLikes answerLikes = postDAO.getLikes(postId, userId);
        Integer countComments = postDAO.getCountComments(postId);

        InfoAboutCommentsAndLikesDTO info = new InfoAboutCommentsAndLikesDTO();
        info.setPostId(postId);
        info.setCountComments(countComments);
        info.setCountLikes(answerLikes.countLikes);
        info.setHasLike(answerLikes.hasLike);

        return info;
    }
}
