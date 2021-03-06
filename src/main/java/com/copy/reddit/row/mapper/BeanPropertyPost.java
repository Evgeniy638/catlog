package com.copy.reddit.row.mapper;


import com.copy.reddit.model.Post;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class BeanPropertyPost implements RowMapper<Post> {
    @Override
    public Post mapRow(ResultSet resultSet, int i) throws SQLException {
        Post post = new Post();
        post.setId(resultSet.getInt("id"));
        post.setText(resultSet.getString("text"));
        post.setUserId(resultSet.getInt("userid"));
        Long longTime = resultSet.getTimestamp("time").getTime();
        post.setTime(longTime);
        post.setAuthorNickname(resultSet.getString("nickname"));
        return post;
    }
}
