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
        const responce = await fetch(`/posts/likes/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": authorization
            }
        });

        return await responce.json();
    },

    async getLikesInfo(authorization, postsIds){
        const responce = await fetch(`/posts/likes/get_own`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : authorization
            },
            body: JSON.stringify(postsIds)
        });

        return await responce.json();
    }
}

export default apiPost;
