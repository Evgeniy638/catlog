import React, {useEffect} from "react";
import "./article.css";
import {postActionCreator, postGetters, postThunkCreators} from "../../bll/reducers/reducerPost";
import {connect} from "react-redux";
import Post from "./Post/Post";
import {userGetters} from "../../bll/reducers/reducerUser";

const ArticleWrap = (props) => {
    useEffect( () => {
        props.cleanPosts();
        props.getPosts(props.authorization, props.tags);
    }, [props.tags]);

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
                          comments={props.comments.filter((c) => c.postId === post.id)}/>
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

    getPosts(authorization, tags) {
        dispatch(postThunkCreators.getPosts(authorization, tags));
    },

    cleanPosts() {
        return dispatch(postActionCreator.cleanPosts());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleWrap);