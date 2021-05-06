import React from "react";
import "../login.css";
import {userActionCreator, userGetters, userThunkCreators} from "../../../bll/reducers/reducerUser";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";

const LoginForm = ({isVisible, goToRegistrationForm, login, loginError, deleteLoginError}) => {
    const onClickGoTo = (e) => {
        e.preventDefault();
        goToRegistrationForm();
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const loginForm = e.currentTarget;
        login(loginForm.elements.nickname.value, loginForm.elements.password.value);
    }

    const handlerDeleteLoginError = () => {
        if (loginError) {
            deleteLoginError();
        }
    }

    return (
        <form
            className={`login__form ${!isVisible && "login__form_hidden"}`}
            onSubmit={onSubmit}
            action="#"
        >
            <div className="login__form-element">
                <h2 className="login__title">Войти</h2>
            </div>

            <TextField
                label="Никнейм"
                name="nickname"
                error={!!loginError}
                onChange={handlerDeleteLoginError}
            />

            <TextField
                label="Пароль"
                name="password"
                type="password"
                error={!!loginError}
                onChange={handlerDeleteLoginError}
            />

            <div
                className={`login__error ${!loginError && "login__error_hidden"}`}
            >
                {loginError}
            </div>

            <div className="login__form-element">
                <button className="login__main-button " type="submit">Войти</button>

                <button
                    onClick={onClickGoTo}
                    className="login__additional-button"
                >Регистрация</button>
            </div>
        </form>
    );
}

const mapStateToProps = (state) => ({
    loginError: userGetters.getLoginError(state)
});

const mapDispatchToProps = (dispatch) => ({
    login(nickname, password) {
        dispatch(userThunkCreators.login(nickname, password));
    },
    deleteLoginError() {
        dispatch(userActionCreator.changeLoginError(""));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
