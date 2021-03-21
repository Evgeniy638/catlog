const apiPost = {
    async createPost(text, tagList, images) {
        const responce = await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": store.authorization
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
    }
}