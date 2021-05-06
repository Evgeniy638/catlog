const apiUser = {
    async login(nickname, password) {
        const response = await fetch("/users/my_login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password})
        });

        if (!response.ok) {
            throw Error("Неправильный логин или пароль");
        }

        return await response.json();
    },

    async registration(nickname, password, avatar) {
        const response = await fetch("/users/registration", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password, avatar})
        });

        if (!response.ok) {
            throw Error("Пользователь с таким ником уже есть");
        }

        return await response.json();
    },

    async getImage(nickname) {
        const response = await fetch(`/users/avatar/${nickname}`);
        return await response.text();
    },

    async getCountPosts(nickname) {
        const response = await fetch(`/users/${nickname}/posts/count`);
        return await response.text();
    },

    async getCountLikes(nickname) {
        const response = await fetch(`/users/${nickname}/posts/likes/count`);
        return await response.text();
    }
}

export default apiUser;
