package com.copy.reddit.dto;

public class LoginDTO {
    private String authorization;
    private String nickname;

    public LoginDTO(String authorization, String nickname) {
        this.authorization = authorization;
        this.nickname = nickname;
    }

    public String getAuthorization() {
        return authorization;
    }

    public void setAuthorization(String authorization) {
        this.authorization = authorization;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
