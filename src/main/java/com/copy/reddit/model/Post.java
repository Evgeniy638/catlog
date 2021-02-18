package com.copy.reddit.model;

public class Post {
    private Integer id;
    private String text;
    private Integer userid;
    private Integer time;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getUserId() {
        return userid;
    }

    public void setUserId(Integer userId) {
        this.userid = userId;
    }

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }
}
