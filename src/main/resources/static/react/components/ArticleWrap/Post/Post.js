import React from "react";
import "../article.css";
import CommentPic from "../comment.svg";

const Post = (props) => {
   const time = new Date(props.time);

   let dd = time.getDate();
   dd = dd < 10 ?`0${dd}` :dd;

   let mm = time.getMonth() + 1;
   mm = mm < 10 ?`0${mm}` :mm;

   let yyyy = time.getFullYear();
   console.log(props, props.images);
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
                    <button className="article__like-button">
                        <span className={`article__like-span ${props.hasLike ? "article__like-button_has-like" : "article__like-button_no-like"}`}></span>
                        <span className="article__count-like-span">{props.countLikes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;