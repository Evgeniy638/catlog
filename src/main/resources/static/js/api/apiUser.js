const apiUser = {
    async login(nickname, password) {
        const responce = await fetch("/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password})
        });

        if (!responce.ok) {
            throw Error("неправильный логин или пароль");
        }

        return await responce.json();
    },

    async registration(nickname, password) {
        const responce = await fetch("/users/registration", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nickname, password})
        });

        if (!responce.ok) {
            throw Error("такой пользователь уже есть");
        }

        return await responce.json();
    }
}