package com.copy.reddit.dto;

import java.util.List;

public class HeadCommentDTO {
    private int id;
    private String text;
    private String authorNickname;
    private int postId;
    private boolean hasAnswers;
    private List<RepliesDTO> replies;

    public HeadCommentDTO() {
    }

    public HeadCommentDTO(int id, String text, String authorNickname, int postId, boolean hasAnswers, List<RepliesDTO> replies) {
        this.id = id;
        this.text = text;
        this.authorNickname = authorNickname;
        this.postId = postId;
        this.hasAnswers = hasAnswers;
        this.replies = replies;
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

    public boolean isHasAnswers() {
        return hasAnswers;
    }

    public void setHasAnswers(boolean hasAnswers) {
        this.hasAnswers = hasAnswers;
    }

    public List<RepliesDTO> getReplies() {
        return replies;
    }

    public void setReplies(List<RepliesDTO> replies) {
        this.replies = replies;
    }
}
