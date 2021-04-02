const apiPost = {
    async createPost(text, tagList, images, authorization) {
        const responce = await fetch("/posts", {
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
    },

    async getAllPosts() {
        const responce = await fetch("/posts");
        return await responce.json();
    },

    async filterPostsByTag(tag) {
        const responce = await fetch(`/posts/${tag}`);
        return await responce.json();
    },

    async createLike(authorization, postId){
        const responce = await fetch(`/posts/likes/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": store.authorization
            }
        });

        return await responce.json();
    },

    async deleteLike(authorization, postId){
        const responce = await fetch(`/posts/likes/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": authorization
            }
        });

        return await responce.json();
    }
}