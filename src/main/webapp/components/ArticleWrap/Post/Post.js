import React, {useEffect, useState} from "react";
import "../article.css";
import CommentPic from "../comment.svg";
import apiPost from "../../../api/apiPost";
import {postActionCreator, postGetters, postThunkCreators} from "../../../bll/reducers/reducerPost";
import {userGetters} from "../../../bll/reducers/reducerUser";
import {connect} from "react-redux";
import ListComments from "./ListComments/ListComments";
import {loginActionCreators} from "../../../bll/reducers/reducerLogin";
import {Link} from "react-router-dom";

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
}

const Post = (props) => {
   const [isActiveComment, setIsActiveComment] = useState(false);
   const time = new Date(props.time);

   let dd = time.getDate();
   dd = dd < 10 ?`0${dd}` :dd;

   let mm = time.getMonth() + 1;
   mm = mm < 10 ?`0${mm}` :mm;

   let yyyy = time.getFullYear();
   console.log(props, props.images);

   const [bottomVisible, setBottomVisible] = useState(false);

    const likeClick = (e) => {
        e.preventDefault();
        if(props.authorization) {
            likeCheck(props, props.authorization);
        }
        else{
            props.toggleOpenLogin();
        }
    }

    const commentClick = () => {
        setIsActiveComment(!isActiveComment);
        props.getComments(props.id);
    }

   useEffect(() => {
       const heightContent = document.getElementById(`article__content${props.id}`).scrollHeight;
       if(heightContent > 350){
           setBottomVisible(true);
       }
   }, [props.images])
   return(
       <div className="article">
            <div className="article__info">
                <div className="article__author">{props.authorNickname}</div>
                <div className="article__time">{dd}.{mm}.{yyyy}</div>
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
                            <Link style={{ textDecoration: 'none' }} to={`/home/${tag.name}`}>
                                {tag.name}
                            </Link>
                        </div>
                    ))}
                </div>
            <div className="article__like-and-comment-area">{props.countComments} комментариев
                <div>
                    <button className="article__comment-button" onClick={commentClick}>
                        <img src={CommentPic} alt="comment"/>
                    </button>
                    <button className="article__like-button" onClick={likeClick}>
                        <span className={`article__like-span ${props.hasLike ? "article__like-button_has-like" : "article__like-button_no-like"}`}></span>
                        <span className="article__count-like-span">{props.countLikes}</span>
                    </button>
                </div>
            </div>
           {
               isActiveComment &&
               <ListComments
                    postId={props.id}
                    comments={props.comments}
               />
           }
        </div>
    );
}

const mapStateToProps = (state) => ({
    authorization: userGetters.getAuthorization(state)
});

const mapDispatchToProps = (dispatch) => ({
    getLikesInfo(authorization, postsIds) {
        dispatch(postThunkCreators.getLikesInfo(authorization, postsIds));
    },

    changeCountLikes(countLikes, postId) {
        dispatch(postActionCreator.changeCountLikes(countLikes, postId))
    },

    toggleOpenLogin() {
        dispatch(loginActionCreators.toggleOpen());
    },

    getComments(postId) {
        dispatch(postThunkCreators.getComments(postId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
