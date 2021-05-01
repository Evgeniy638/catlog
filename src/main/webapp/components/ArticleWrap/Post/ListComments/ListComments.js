import React, {useEffect, useState} from 'react';
import * as SockJSClient from 'sockjs-client';
import Post from "../Post";
import {postActionCreator} from "../../../../bll/reducers/reducerPost";
import { connect } from 'react-redux';

const SESSION_ITEM_COMMENTS = "SESSION_ITEM_COMMENTS";

var stompClient = null;

const ListComments = (props) => {
    const [comments, setComments] = useState([]);

    const [newComment, setNewComment] = useState("");

    const saveComments = (comments) => {
        sessionStorage.setItem(SESSION_ITEM_COMMENTS, JSON.stringify(comments));
        setComments(comments);
    }

    const getComments = () => {
        return JSON.parse(sessionStorage.getItem(SESSION_ITEM_COMMENTS)) || [];
    }

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
        console.log("connected");
        console.log(props.postId);
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
        console.log("THERE TWO ->", comment);
        props.addNewComment(comment);
    };

    const sendComment = () => {
        const comment = {
            text: newComment,
            postId: props.postId,
            authorNickname: props.authorNickname,
            headCommentId: props.headCommentId
        };
        stompClient.send("/app/comments", {}, JSON.stringify(comment));
    };
    if(props.comments.length === 0){
        return null;
    }
    return (
        <div className="article__comment-section">
            <div className="article__comments">
                ListComments
                <div>
                    {
                        comments.map((c, i) => (<div key={i}>{c.text}</div>))
                    }
                </div>

                {
                    props.comments.map((comment) => (
                        <>
                        <div className="article__first-level-comment">
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
                    ))
                }
            </div>


            <div className="article__comment-area">
                <textarea name="commentText" className="article__comment-field"
                          placeholder="введите комментарий">
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                </textarea>
                <button className="article__comment" type="submit" onClick={sendComment}>Отправить</button>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    addNewComment(comment) {
        dispatch(postActionCreator.addNewComment(comment));
    }
});

export default connect(null, mapDispatchToProps)(ListComments);
