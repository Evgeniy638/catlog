import React from "react";
import {userThunkCreators} from "../../../bll/reducers/reducerUser";
import {connect} from "react-redux";
import {util} from "../../../util/util";

const RegistrationForm = ({isVisible, goToLoginForm, registration}) => {
    const onClickGoTo = (e) => {
        e.preventDefault();
        goToLoginForm();
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const loginForm = e.currentTarget;
        util.readFilesAsDataURL([...loginForm.elements.avatar.files], (results) => {
            registration(
                loginForm.elements.nickname.value,
                loginForm.elements.password.value,
                results[0].src
            );
        });
    }

    return (
        <form
            onSubmit={onSubmit}
            className={`login__form ${!isVisible && "login__form_hidden"}`}
            id="registrationForm"
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

            <label className="login__form-element">
                Повторите пароль:
                <input className="login__input" name="passwordAgain" placeholder="пароль" type="password"/>
            </label>

            <label>
                Аватар:
                <input name="avatar" type="file"/>
            </label>

            <div className="login__error login__error_hidden"></div>

            <div className="login__form-element">
                <button className="login__main-button" type="submit">Зарегистрироваться</button>

                <button
                    onClick={onClickGoTo}
                    className="login__additional-button"
                >Войти</button>
            </div>
        </form>
    );
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    registration(nickname, password, avatar) {
        dispatch(userThunkCreators.registration(nickname, password, avatar));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
