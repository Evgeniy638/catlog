import React from "react";
import "../login.css";
import {userThunkCreators} from "../../../bll/reducers/reducerUser";
import {connect} from "react-redux";

const LoginForm = ({isVisible, goToRegistrationForm, login}) => {
    const onClickGoTo = (e) => {
        e.preventDefault();
        goToRegistrationForm();
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const loginForm = e.currentTarget;
        login(loginForm.elements.nickname.value, loginForm.elements.password.value);
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

            <label className="login__form-element">
                Логин:
                <input className="login__input" name="nickname" placeholder="логин"/>
            </label>

            <label className="login__form-element">
                Пароль:
                <input className="login__input" name="password" placeholder="пароль" type="password"/>
            </label>

            <div className="login__error login__error_hidden"></div>

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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
   login(nickname, password) {
       dispatch(userThunkCreators.login(nickname, password));
   }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
