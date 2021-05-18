import React, {useEffect, useState} from 'react';
import * as SockJSClient from 'sockjs-client';
import Post from "../Post";
import {postActionCreator} from "../../../../bll/reducers/reducerPost";
import { connect } from 'react-redux';
import Comment from "./Comment";
import {loginActionCreators} from "../../../../bll/reducers/reducerLogin";

const SESSION_ITEM_COMMENTS = "SESSION_ITEM_COMMENTS";

let stompClient = null;

const ListComments = (props) => {
    useEffect(() => {
        connect();
        return () => {
            stompClient.disconnect();
        }
    }, []);

    const connect = async () => {
        const Stomp = require("stompjs");
        const SockJS = new SockJSClient("/ws");
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

    const createSendComment = (headCommentId) => (e) => {
        e.preventDefault();
        if(props.authorization) {
            let field = e.currentTarget;
            field.commentText.disabled = true;
            if (field.commentText.value === "") {
                return;
            }
            const comment = {
                text: field.commentText.value,
                postId: props.postId,
                authorNickname: props.authorNickname,
                headCommentId
            };
            field.commentText.value = "";
            stompClient.send("/app/comments", {}, JSON.stringify(comment));
            field.commentText.disabled = false;
        }
        else{
            props.toggleOpenLogin();
        }
    };

    return (
        <div className="article__comment-section">
            <div className="article__comments">
                {
                    props.comments ? props.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            sendComment={createSendComment(comment.id)}
                        />
                    )) : null
                }
            </div>

            <form
                onSubmit={createSendComment()}
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
    },

    toggleOpenLogin() {
        dispatch(loginActionCreators.toggleOpen());
    }
});

export default connect(null, mapDispatchToProps)(ListComments);
