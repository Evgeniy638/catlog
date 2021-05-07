import React, {useEffect} from "react";
import "./article.css";
import {postActionCreator, postGetters, postThunkCreators} from "../../bll/reducers/reducerPost";
import {connect} from "react-redux";
import Post from "./Post/Post";
import {userGetters} from "../../bll/reducers/reducerUser";

const ArticleWrap = (props) => {
    useEffect( () => {

    }, [props.sinceId]);

    useEffect(() => {
        let handler;

        const callback = (sinceId) => {
            handler = () => {
                let scrollHeight = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );

                if (window.pageYOffset + document.documentElement.clientHeight + 400 > scrollHeight) {
                    window.removeEventListener("scroll", handler);

                    props.getPosts(props.authorization, sinceId, false, {
                        tags: props.tags,
                        nickname: props.nickname
                    }, callback);
                }
            }

            window.addEventListener("scroll", handler);
        }



        props.getPosts(props.authorization, -1, true, {
            tags: props.tags,
            nickname: props.nickname
        }, callback);

        return () => {
            window.removeEventListener("scroll", handler);
        }
    }, [props.tags, props.nickname]);

    useEffect(() => {
        if(props.authorization) {
            props.getLikesInfo(props.authorization, props.posts.map(p => p.id));
        }
    }, [props.authorization]);
    return (
        <div className="article-wrap">
            {
                props.posts.map((post) => (
                    <Post text={post.text}
                          id={post.id}
                          authorization={props.authorization}
                          authorNickname={post.authorNickname}
                          countLikes={post.countLikes}
                          countComments={post.countComments}
                          hasLike={post.hasLike}
                          time={post.time}
                          images={post.images}
                          tags={post.tagList}
                          key={post.id}
                          avatar={post.avatar}
                          comments={props.comments.filter((c) => c.postId === post.id)}
                          headCommentId={post.headCommentId}
                          />
                ))
            }
        </div>
    );
}

const mapStateToProps = (state) => ({
    posts: postGetters.getPosts(state),
    authorization: userGetters.getAuthorization(state),
    comments: postGetters.getComments(state)
});

const mapDispatchToProps = (dispatch) => ({
    getLikesInfo(authorization, postsIds) {
        dispatch(postThunkCreators.getLikesInfo(authorization, postsIds));
    },

    getPosts(authorization, sinceId, isAllClean, {tags, nickname}, callback) {
        dispatch(postThunkCreators.getPosts(authorization, sinceId, isAllClean, {tags, nickname}, callback));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleWrap);