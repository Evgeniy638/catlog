const apiUser = {
    async login(nickname, password) {
        const response = await fetch("/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password})
        });

        if (!response.ok) {
            throw Error("неправильный логин или пароль");
        }

        return await response.json();
    },

    async registration(nickname, password) {
        const response = await fetch("/users/registration", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password})
        });

        if (!response.ok) {
            throw Error("такой пользователь уже есть");
        }

        return await response.json();
    }
}

export default apiUser;
