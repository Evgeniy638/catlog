const authorizationWrap = document.getElementById("authorization-wrap");
const loginWrap = document.querySelector(".login");
const registrationForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");

function showLoginErrorMessage(loginError, message) {
    loginError.classList.remove("login__error_hidden");
    loginError.textContent = message;
}

authorizationWrap.querySelector(".authorization-button").addEventListener("click", () => {
    loginWrap.classList.toggle("login_hidden");
});

document.getElementById("transitionToRegistration").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("login__form_hidden");
    registrationForm.classList.remove("login__form_hidden");
});

document.getElementById("transitionToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("login__form_hidden");
    registrationForm.classList.add("login__form_hidden");
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const loginError = loginForm.querySelector(".login__error");

    try {
        const {authorization, nickname} = await apiUser
            .login(loginForm.elements.nickname.value, loginForm.elements.password.value);
        store.authorization = authorization;
        store.nickname = nickname;
        authorizationWrap.innerHTML = nickname;
        loginWrap.classList.add("login_hidden");
    } catch (e) {
        showLoginErrorMessage(loginError, e.message);
    }
});
