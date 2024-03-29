import React, {useEffect, useState} from 'react';
import '../article.css';
import apiPost from '../../../api/apiPost';
import {postActionCreator, postThunkCreators} from '../../../bll/reducers/reducerPost';
import {userGetters} from '../../../bll/reducers/reducerUser';
import {connect} from 'react-redux';
import ListComments from './ListComments/ListComments';
import {loginActionCreators} from '../../../bll/reducers/reducerLogin';
import {Link} from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import {Skeleton} from '@material-ui/lab';

const likeCheck = async (post, authorization) => {
    let countLikes;
    if(post.hasLike) {
        countLikes = await apiPost.deleteLike(authorization, post.id);
    }
    else {
        countLikes = await apiPost.createLike(authorization, post.id);
    }

    post.getLikesInfo(authorization, [post.id]);
    post.changeCountLikes(countLikes, post.id);
};

const Post = (props) => {
   const [isActiveComment, setIsActiveComment] = useState(false);
   const time = new Date(props.time);

   let dd = time.getDate();
   dd = dd < 10 ?`0${dd}` :dd;

   let mm = time.getMonth() + 1;
   mm = mm < 10 ?`0${mm}` :mm;

   let yyyy = time.getFullYear();

   const [bottomVisible, setBottomVisible] = useState(false);

    const likeClick = (e) => {
        e.preventDefault();
        if(props.authorization) {
            likeCheck(props, props.authorization);
        }
        else{
            props.toggleOpenLogin();
        }
    };

    const deletePost = () => {
        props.deletePost(props.id);
    };

    const commentClick = () => {
        setIsActiveComment(!isActiveComment);
        props.getComments(props.id);
    };

   useEffect(() => {
       const heightContent = document.getElementById(`article__content${props.id}`).scrollHeight;
       if(heightContent > 350){
           setBottomVisible(true);
       }
   }, [props.images]);
   return(
       <div className="article">
            <div className="article__info">
                <Link
                    to={`/user/${props.authorNickname}`}
                    style={{textDecoration: 'none', color: 'var(--init-color)'}}
                >
                <div className="article__author-wrap">
                    {
                        props.avatar ?
                        <img className="article__avatar" src={props.avatar}/> :
                        <Skeleton variant="circle" width={30} height={30}/>
                    }
                    <div className="article__author">{props.authorNickname}</div>
                </div>
                </Link>
                <div className="article__deletebutton">
                    <div className="article__time">{dd}.{mm}.{yyyy}</div>
                    {
                        props.authorNickname === props.nickname ?
                            <div>
                                <Button onClick={deletePost}><CloseIcon/></Button>
                            </div>
                            : null
                    }
                </div>
            </div>
            <input type="checkbox" className="article__hiddenchecker" id={`article__hiddenchecker${props.id}`}/>
                <div className="article__content" id={`article__content${props.id}`}>
                    <div className="article__text"><p>{props.text}</p></div>
                    <div className="article__images">
                        {
                            props.images &&
                            props.images.map((image) => (
                            <img className="article__image" src={image.src} alt={image.name} key={image.id}/>
                        ))}
                    </div>
                    {bottomVisible ? <div className="article__bottom"></div> : null}
                </div>
            {bottomVisible ? <label htmlFor={`article__hiddenchecker${props.id}`} className="article__hiddenbutton"></label> : null}
            <div className="article__tags">
                {
                    props.tags &&
                    props.tags.map((tag) => (
                        <div className="article__tag" key={tag.id}>
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={`/home/${tag.name}`}
                                className="article__tag-link"
                            >
                                {tag.name}
                            </Link>
                        </div>
                    ))}
            </div>
            <div className="article__like-and-comment-area">комментарии: {props.countComments}
                <div>
                    <Button className="article__comment-button" onClick={commentClick}>
                        <CommentIcon/>
                    </Button>
                    <Button className="article__like-button" onClick={likeClick}>
                        <span className={'article__like-span'}>{props.hasLike ? <FavoriteIcon/>: <FavoriteBorderIcon/>}</span>
                        <span className="article__count-like-span">{props.countLikes}</span>
                    </Button>
                </div>
            </div>
           {
               isActiveComment &&
               <ListComments
                    postId={props.id}
                    authorization={props.authorization}
                    comments={props.comments}
                    authorNickname={props.nickname}
                    headCommentId={props.headCommentId}
               />
           }
        </div>
    );
};

const mapStateToProps = (state) => ({
    authorization: userGetters.getAuthorization(state),
    nickname: userGetters.getNickname(state),
});

const mapDispatchToProps = (dispatch) => ({
    getLikesInfo(authorization, postsIds) {
        dispatch(postThunkCreators.getLikesInfo(authorization, postsIds));
    },

    changeCountLikes(countLikes, postId) {
        dispatch(postActionCreator.changeCountLikes(countLikes, postId));
    },

    toggleOpenLogin() {
        dispatch(loginActionCreators.toggleOpen());
    },

    getComments(postId) {
        dispatch(postThunkCreators.getComments(postId));
    },

    deletePost(postId) {
        dispatch(postThunkCreators.deletePost(postId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
