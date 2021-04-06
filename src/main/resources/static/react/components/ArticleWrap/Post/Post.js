import React from "react";
import "../article.css";
import CommentPic from "../comment.svg";
import apiPost from "../../../api/apiPost";
import {postGetters, postThunkCreators} from "../../../bll/reducers/reducerPost";
import {userGetters} from "../../../bll/reducers/reducerUser";
import {connect} from "react-redux";

const likeCheck = (post, authorization) => {
    if(post.hasLike) {
        apiPost.deleteLike(authorization, post.id);
    }
    else {
        apiPost.createLike(authorization, post.id);
    }
    post.getLikesInfo(authorization, [post.id])
}

const Post = (props) => {
   const time = new Date(props.time);

   let dd = time.getDate();
   dd = dd < 10 ?`0${dd}` :dd;

   let mm = time.getMonth() + 1;
   mm = mm < 10 ?`0${mm}` :mm;

   let yyyy = time.getFullYear();
   console.log(props, props.images);

    const likeClick = (e) => {
        e.preventDefault();
        likeCheck(props, props.authorization);
    }

   return(
       <div className="article">
            <div className="article__info">
                <div className="article__author">{props.authorNickname}</div>
                <div className="article__time">{dd}.{mm}.{yyyy}</div>
            </div>
            <input type="checkbox" className="article__hiddenchecker" id={`article__hiddenchecker${props.id}`} />
                <div className="article__text"><p>{props.text}</p></div>
            <div className="article__images">
                {
                    props.images &&
                    props.images.map((image) => (
                    <img src={image.src} alt={image.name} key={image.id}/>
                ))}
            </div>
            <div className="article__bottom"></div>
            <label htmlFor={`article__hiddenchecker${props.id}`} className="article__hiddenbutton"></label>
            <div className="article__tags">
                {
                    props.tags &&
                    props.tags.map((tag) => (
                        <div className="article__tag" key={tag.id}><a href="">{tag.name}</a></div>
                    ))}
                </div>
            <div className="article__like-and-comment-area">{props.countComments} комментариев
                <div>
                    <button className="article__comment-button"><img src={CommentPic} alt="comment"/></button>
                    <button className="article__like-button" onClick={likeClick}>
                        <span className={`article__like-span ${props.hasLike ? "article__like-button_has-like" : "article__like-button_no-like"}`}></span>
                        <span className="article__count-like-span">{props.countLikes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    authorization: userGetters.getAuthorization(state)
});

const mapDispatchToProps = (dispatch) => ({
    getLikesInfo(authorization, postsIds) {
        dispatch(postThunkCreators.getLikesInfo(authorization, postsIds));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);