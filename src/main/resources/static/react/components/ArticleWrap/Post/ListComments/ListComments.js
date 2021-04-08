import React, {useEffect, useState} from 'react';
import * as SockJSClient from 'sockjs-client';

const SESSION_ITEM_COMMENTS = "SESSION_ITEM_COMMENTS";

var stompClient = null;

const ListComments = ({postId}) => {
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
        console.log(postId);
        stompClient.subscribe(
            "/topic/" + postId + "/comments",
            onCommendReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const onCommendReceived = (msg) => {
        const comment = JSON.parse(msg.body);
        saveComments([...getComments(), comment]);
    };

    const sendComment = () => {
        const comment = {
            text: newComment,
            postId
        };
        stompClient.send("/app/comments", {}, JSON.stringify(comment));
    };

    return (
        <div>
            ListComments
            <div>
                {
                    comments.map((c, i) => (<div key={i}>{c.text}</div>))
                }
            </div>
            <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
            />
            <button onClick={sendComment}>Отправить</button>
        </div>
    );
}

export default ListComments;
