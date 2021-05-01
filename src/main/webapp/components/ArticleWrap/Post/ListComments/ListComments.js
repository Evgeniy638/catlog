import React, {useEffect, useState} from 'react';
import * as SockJSClient from 'sockjs-client';
import Post from "../Post";
import {postActionCreator} from "../../../../bll/reducers/reducerPost";
import { connect } from 'react-redux';

const SESSION_ITEM_COMMENTS = "SESSION_ITEM_COMMENTS";

let stompClient = null;

const ListComments = (props) => {
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        connect();
        return () => {
            stompClient.disconnect();
        }
    }, []);

    const connect = async () => {
        const Stomp = require("stompjs");
        const SockJS = new SockJSClient("http://localhost:8080/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        stompClient.subscribe(
            "/topic/" + props.postId + "/comments",
            onCommendReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const onCommendReceived = (msg) => {
        const comment = JSON.parse(msg.body);
        props.addNewComment(comment);
    };

    const sendComment = (e) => {
        e.preventDefault();
        let field = e.currentTarget;
        field.commentText.disabled = true;
        if(field.commentText.value === ""){
            return;
        }
        const comment = {
            text: field.commentText.value,
            postId: props.postId,
            authorNickname: props.authorNickname,
            headCommentId: props.headCommentId
        };
        field.commentText.value = "";
        stompClient.send("/app/comments", {}, JSON.stringify(comment));
        field.commentText.disabled = false;
    };
    return (
        <div className="article__comment-section">
            <div className="article__comments">
                {
                    props.comments ? props.comments.map((comment) => (
                        <>
                        <div key={comment.id} className="article__first-level-comment">
                            <div className="article__author">{comment.authorNickname}</div>
                            <div className="article__comment-content">{comment.text}
                            </div>
                            <div style= {{display: "flex", justifyContent: "flex-end"}}>
                                <button className="article__reply-button">Ответить</button>
                            </div>
                        </div>
                            {comment.hasAnswers ? comment.replies.map((reply) =>
                                (
                                    <div className="article__second-level-comment">
                                        <div className="article__author">{reply.authorNickname}</div>
                                        <div className="article__comment-content">{reply.text}</div>
                                    </div>
                                )): null}
                        </>
                    )) : null
                }
            </div>

            <form
                onSubmit={sendComment}
                className="comment-area"
                encType="multipart/form-data"
                action="#"
            >
            <div className="article__comment-area">
                <textarea name="commentText" className="article__comment-field"
                          placeholder="введите комментарий">
                </textarea>
                <button className="article__comment" type="submit">Отправить</button>
            </div>
            </form>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    addNewComment(comment) {
        dispatch(postActionCreator.addNewComment(comment));
    }
});

export default connect(null, mapDispatchToProps)(ListComments);
