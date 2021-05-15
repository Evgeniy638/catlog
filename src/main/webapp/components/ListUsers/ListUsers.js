import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import apiUser from "../../api/apiUser";

export const pathsListUsers = {
    PATH_FOLLOWERS: "followers",
    PATH_FOLLOWING: "following"
};

const getUserAvatar = async (nickname, setUsers) => {
    const avatar = await apiUser.getImage(nickname);
    setUsers((users) => {
       return users.map(u => {
           return u.nickname === nickname ?{...u, avatar} :u;
       })
    });
}

const ListUsers = ({nickname}) => {
    const {typeUsers} = useParams();

    if (
        typeUsers !== pathsListUsers.PATH_FOLLOWERS &&
        typeUsers !== pathsListUsers.PATH_FOLLOWING
    ) {
        return null;
    }

    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            let userNicknames = [];

            if (typeUsers === pathsListUsers.PATH_FOLLOWING) {
                userNicknames = await apiUser.getAllFollowings(nickname);
            } else {
                userNicknames = await apiUser.getAllFollowers(nickname);
            }

            console.log(userNicknames);
            setUsers(userNicknames.map(nickname => ({nickname})));

            userNicknames.forEach(nickname => {
                getUserAvatar(nickname, setUsers);
            });
        })();
    }, [typeUsers, nickname]);

    return (
        <div>
            {
                users.map(u => (
                    <div key={u.nickname}>
                        {
                            u.avatar &&
                            <img src={u.avatar} alt={u.nickname}/>
                        }
                        <p>{u.nickname}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ListUsers;
