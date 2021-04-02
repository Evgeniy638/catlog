import React from "react";
import "./header.css";
import "./search-input.css";
import "./authorization.css";
import {loginActionCreators} from "../../bll/reducers/reducerLogin";
import {connect} from "react-redux";
import {userGetters} from "../../bll/reducers/reducerUser";

const Header = (props) => {
    return (
        <header className="header">
            <div className="header__child">
                <div className="header__logo-wrap">
                    <div className="header__logo-image"></div>
                    <h1 className="header__title">Catlog</h1>
                </div>
            </div>

            <div className="header__child header__child_grow">
                <div className="search-input">
                    <input className="search-input__input" placeholder="введите тег"/>
                </div>
            </div>

            <div className="header__child">
                <div id="authorization-wrap" className="authorization">
                    {
                        props.nickname
                            ?props.nickname
                            :<button
                                onClick={props.toggleOpenLogin}
                                className="authorization-button"
                            >Войти</button>
                    }
                </div>
            </div>
        </header>
    );
}

const mapStateToProps = (state) => ({
    nickname: userGetters.getNickname(state)
});

const mapDispatchToProps = (dispatch) => ({
   toggleOpenLogin() {
       dispatch(loginActionCreators.toggleOpen());
   }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);