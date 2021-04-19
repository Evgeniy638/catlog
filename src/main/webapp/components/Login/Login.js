import React, {useState} from "react";
import "./login.css"
import LoginForm from "./LoginForm/LoginForm";
import RegistrationForm from "./RegistrationForm/RegistrationForm";
import {loginGetters} from "../../bll/reducers/reducerLogin";
import {connect} from "react-redux";

const Login = (props) => {
    const [isActiveLoginForm, setIsActiveLoginForm] = useState(true);

    return (
        <section className={`login ${!props.isOpen && "login_hidden"}`}>
            <LoginForm
                isVisible={isActiveLoginForm}
                goToRegistrationForm={() => setIsActiveLoginForm(false)}
            />
            <RegistrationForm
                isVisible={!isActiveLoginForm}
                goToLoginForm={() => setIsActiveLoginForm(true)}
            />
        </section>
    );
}

const mapStateToProps = (state) => ({
    isOpen: loginGetters.getIsOpenLogin(state)
});

export default connect(mapStateToProps)(Login);
