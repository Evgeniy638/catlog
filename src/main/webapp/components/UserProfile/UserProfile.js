import React, {useEffect, useState} from "react";
import { useParams } from "react-router";
import ArticleWrap from "../ArticleWrap/ArticleWrap";
import apiUser from "../../api/apiUser";

import "./UserProfile.css";

function UserProfile() {
    // даннные о польователе
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
    }, []);

    return (
        <div>
            <div>
                <div>
                    <img src={avatar} alt="аватар"/>
                </div>
                <div>{nickname}</div>
                <div>
                    Количество лайков: {countLikes}
                </div>
                <div>
                    Количество постов: {countPosts}
                </div>
            </div>
            <ArticleWrap nickname={nickname}/>
        </div>
    )
}

export default UserProfile;
