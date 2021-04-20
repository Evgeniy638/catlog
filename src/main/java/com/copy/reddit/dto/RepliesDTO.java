package com.copy.reddit.dto;

public class RepliesDTO {
    private int id;
    private String text;
    private String authorNickname;
    private int postId;
    private Integer headCommentId;

    public RepliesDTO() {
    }

    public RepliesDTO(int id, String text, String authorNickname, int postId, Integer headCommentId) {
        this.id = id;
        this.text = text;
        this.authorNickname = authorNickname;
        this.postId = postId;
        this.headCommentId = headCommentId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAuthorNickname() {
        return authorNickname;
    }

    public void setAuthorNickname(String authorNickname) {
        this.authorNickname = authorNickname;
    }

    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }

    public Integer getHeadCommentId() {
        return headCommentId;
    }

    public void setHeadCommentId(Integer headCommentId) {
        this.headCommentId = headCommentId;
    }
}
