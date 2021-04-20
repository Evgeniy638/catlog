package com.copy.reddit.model;

public class Comment {
    private Integer id;
    private String text;
    private String authorNickname;
    private Integer postId;
    private Integer headCommentId;
    private Boolean hasAnswers;

    public String getAuthorNickname() {
        return authorNickname;
    }

    public void setAuthorNickname(String authorNickname) {
        this.authorNickname = authorNickname;
    }

    public Boolean getHasAnswers() {
        return hasAnswers;
    }

    public void setHasAnswers(Boolean hasAnswers) {
        this.hasAnswers = hasAnswers;
    }

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

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public Integer getHeadCommentId() {
        return headCommentId;
    }

    public void setHeadCommentId(Integer headCommentId) {
        this.headCommentId = headCommentId;
    }
}
