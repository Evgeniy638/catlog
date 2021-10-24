import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import apiUser from '../../api/apiUser';
import './ListUsers.css';
import {Skeleton} from '@material-ui/lab';
import {styleLink} from '../UserProfile/UserProfile';

export const pathsListUsers = {
    PATH_FOLLOWERS: 'followers',
    PATH_FOLLOWING: 'following'
};

const getUserAvatar = async (nickname, setUsers) => {
    const avatar = await apiUser.getImage(nickname);
    setUsers((users) => {
       return users.map(u => {
           return u.nickname === nickname ?{...u, avatar} :u;
       });
    });
};

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
        <div className="list-users">
            {
                users.map(u => (
                    <div key={u.nickname} className="list-users__row-user">
                        <Link to={`/user/${u.nickname}`} style={styleLink}>
                            <span className="list-users__row-user-flex">
                                {
                                    u.avatar
                                        ?<img src={u.avatar} alt={u.nickname}/>
                                        :<Skeleton variant="circle" width={50} height={50}/>
                                }
                                <span className="list-users__usernames">{u.nickname}</span>
                            </span>
                        </Link>
                    </div>
                ))
            }
        </div>
    );
};

export default ListUsers;
