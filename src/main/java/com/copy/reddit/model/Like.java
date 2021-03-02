package com.copy.reddit.model;

public class Like {
    private Integer userId;
    private Integer postid;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getPostId() {
        return postid;
    }

    public void setPostId(Integer postId) {
        this.postid = postId;
    }
}
