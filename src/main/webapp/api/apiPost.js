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

    async findMatchesByTags(tagArr) {
        const response = fetch(`/posts/tags/matches/${tagArr.join("+")}`);
        return (await response).json();
    },

    async findPostsByTags(tagArr) {
        const response = fetch(`/posts/tags/${tagArr.join("+")}`);
        return (await response).json();
    },

    async findPostsByNickname(nickname) {
        const response = fetch(`/posts/user/${nickname}`);
        return (await response).json();
    },

    async getAllPosts() {
        const response = await fetch("/posts");
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
        const response = await fetch(`posts/comments/${postId}`);
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
