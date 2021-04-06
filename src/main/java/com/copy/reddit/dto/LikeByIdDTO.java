package com.copy.reddit.dto;

public class LikeByIdDTO {
    private int postId;
    private boolean hasLike;

    public LikeByIdDTO(int postId, boolean hasLike) {
        this.postId = postId;
        this.hasLike = hasLike;
    }

    public boolean isHasLike() {
        return hasLike;
    }

    public void setHasLike(boolean hasLike) {
        this.hasLike = hasLike;
    }

    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }
}
