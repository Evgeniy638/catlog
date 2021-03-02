package com.copy.reddit.model;

public class Comment {
    private Integer id;
    private String text;
    private Integer authorId;
    private Integer postId;
    private Integer headCommentId;
    private Boolean hasAnswers;

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

    public Integer getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Integer authorId) {
        this.authorId = authorId;
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
