import React from "react";
import "./header.css";
import "./authorization.css";
import {loginActionCreators} from "../../bll/reducers/reducerLogin";
import {connect} from "react-redux";
import {userGetters} from "../../bll/reducers/reducerUser";
import SearchInput from "./SearchInput/SearchInput";
import {Link} from "react-router-dom";

const Header = (props) => {
    return (
        <header className="header">
            <div className="header__child">
                <Link style={{ textDecoration: 'none' }} to={"/home"}>
                    <div className="header__logo-wrap">
                        <div className="header__logo-image"></div>
                        <h1 className="header__title">Catlog</h1>
                    </div>
                </Link>
            </div>

            <div className="header__child header__child_grow">
                <SearchInput/>
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