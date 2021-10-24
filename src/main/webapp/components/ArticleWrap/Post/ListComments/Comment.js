import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

const Comment = ({comment, sendComment}) => {
    const [isActiveReplyButton, setActiveReply] = useState(false);

    const showReplyField = () => {
        setActiveReply(!isActiveReplyButton);
    };

    const send = (e) => {
        showReplyField();
        sendComment(e);
    };

    return (
        <>
            <div className="article__first-level-comment">
                <div className="article__author">{comment.authorNickname}</div>
                <div className="article__comment-content">{comment.text}
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button className="article__reply-button" onClick={showReplyField}>Ответить</button>
                </div>
            </div>
                {
                    isActiveReplyButton &&
                    <form
                        onSubmit={send}
                        className="comment-area"
                        encType="multipart/form-data"
                        action="#"
                    >
                        <div className="article__comment-area">
                                            <textarea name="commentText" className="article__comment-field"
                                                      placeholder="введите ответ">
                                            </textarea>
                            <button className="article__comment" type="submit">Отправить</button>
                        </div>
                    </form>
                }

            {comment.hasAnswers ? comment.replies.map((reply) =>
                (
                    <div key={reply.id} className="article__second-level-comment">
                        <div className="article__author">{reply.authorNickname}</div>
                        <div className="article__comment-content">{reply.text}</div>
                    </div>
                )): null}
        </>
    );
};

export default Comment;