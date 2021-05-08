import React, {useEffect, useState} from "react";
import { useParams } from "react-router";
import ArticleWrap from "../ArticleWrap/ArticleWrap";
import apiUser from "../../api/apiUser";

import "./UserProfile.css";
import {userGetters, userThunkCreators} from "../../bll/reducers/reducerUser";
import {connect} from "react-redux";
import Button from "@material-ui/core/Button";
import SubmitBox from "../SubmitBox/SubmitBox";

function UserProfile(props) {
    // даннные о пользователе
    const { nickname } = useParams();
    const [avatar, setAvatar] = useState();
    const [countPosts, setCountPosts] = useState();
    const [countLikes, setCountLikes] = useState();

    useEffect(() => {
        (async () => {
            setAvatar(await apiUser.getImage(nickname));
        })();
        (async () => {
            setCountPosts(await apiUser.getCountPosts(nickname));
        })();
        (async () => {
            setCountLikes(await apiUser.getCountLikes(nickname));
        })();
    }, [nickname]);

    return (
        <div className="profile-page">
            <div>
                {
                    props.nickname === nickname &&
                    <SubmitBox/>
                }
                <ArticleWrap nickname={nickname}/>
            </div>
            <div className="profile-area">
                <div className="profile-area__nickname">{nickname}</div>
                <div className="profile-area__info">
                    <img className="profile-area__avatar" src={avatar} alt="аватар"/>
                    <div className="profile-area__likes">
                        Лайки
                        <br/>
                        {countLikes}
                    </div>
                    <div className="profile-area__posts">
                        Посты
                        <br/>
                        {countPosts}
                    </div>
                </div>
                {
                    props.nickname === nickname &&
                    <div className="profile-area__logout">
                        <Button onClick={props.logout} color="secondary">
                            Выйти
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    nickname: userGetters.getNickname(state)
})

const mapDispatchToProps = (dispatch) => ({
    logout() {
        dispatch(userThunkCreators.logout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
