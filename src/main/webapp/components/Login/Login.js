import React, {useState} from "react";
import "./login.css"
import LoginForm from "./LoginForm/LoginForm";
import RegistrationForm from "./RegistrationForm/RegistrationForm";
import {loginGetters} from "../../bll/reducers/reducerLogin";
import {connect} from "react-redux";
import {unstable_createMuiStrictModeTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";

const theme = unstable_createMuiStrictModeTheme({
    palette: {
        primary: {
            main: "#e0b000"
        }
    }
});

const Login = (props) => {
    const [isActiveLoginForm, setIsActiveLoginForm] = useState(true);

    return (
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => ({
    isOpen: loginGetters.getIsOpenLogin(state)
});

export default connect(mapStateToProps)(Login);
