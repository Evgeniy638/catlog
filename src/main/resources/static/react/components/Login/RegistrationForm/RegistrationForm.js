import React from "react";

const RegistrationForm = ({isVisible, goToLoginForm}) => {
    const onClickGoTo = (e) => {
        e.preventDefault();
        goToLoginForm();
    }

    return (
        <form
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

export default RegistrationForm;
