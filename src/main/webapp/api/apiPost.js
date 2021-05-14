const apiPost = {
    async createPost(text, tagList, images, authorization) {
        const response = await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            body: JSON.stringify({
                text,
                time: Date.now(),
                tagList,
                images
            })
        });

        return await response.json();
    },

    async deletePost(postId){
        const response = await fetch(`/posts/delete/${postId}`, {
            method: "DELETE"
        });
    },

    async findMatchesByTags(tagArr) {
        const response = await fetch(`/posts/tags/matches/${tagArr.join("+")}`);
        return await response.json();
    },

    async findPostsByTags(tagArr, sinceId) {
        const response = await fetch(`/posts/tags/find/${tagArr.join("+")}?sinceId=${sinceId}`);
        return await response.json();
    },

    async findPostsByNickname(nickname, sinceId) {
        const response = await fetch(`/posts/user/${nickname}/${sinceId}`);
        return await response.json();
    },

    async getAllPosts(sinceId) {
        const response = await fetch(`/posts/${sinceId}`);
        return await response.json();
    },

    async filterPostsByTag(tag) {
        const response = await fetch(`/posts/${tag}`);
        return await response.json();
    },

    async createLike(authorization, postId){
        const response = await fetch(`/posts/likes/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": authorization
            }
        });

        return await response.json();
    },

    async deleteLike(authorization, postId){
        const response = await fetch(`/posts/likes/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": authorization
            }
        });

        return await response.json();
    },

    async getLikesInfo(authorization, postsIds){
        const response = await fetch(`/posts/likes/get_own`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : authorization
            },
            body: JSON.stringify(postsIds)
        });

        return await response.json();
    },

    async getCommentsByPostId(postId){
        const response = await fetch(`/posts/comments/${postId}`);
        return await response.json();
    },

    async getImagesByPostId(postId) {
        const response = await fetch(`/posts/images/${postId}`);
        return await response.json();
    },

    async getInfoAboutCommentsAndLikes(postId, authorization) {
        const response = await fetch(`/posts/info_about_comments_and_likes/${postId}`, {
            headers: {
                "Authorization": authorization
            }
        });
        return await response.json();
    }
}

export default apiPost;
