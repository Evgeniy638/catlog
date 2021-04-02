import React, {useEffect} from "react";
import "./article.css";
import {postGetters, postThunkCreators} from "../../bll/reducers/reducerPost";
import {connect} from "react-redux";
import Post from "./Post/Post";

const ArticleWrap = (props) => {
    useEffect( () => {
        props.getPosts();
    }, []);
    return (
        <div className="article-wrap">
            {
                props.posts.map((post) => (
                    <Post text={post.text}
                          id={post.id}
                          authorNickname={post.authorNickname}
                          countLikes={post.countLikes}
                          countComments={post.countComments}
                          hasLike={post.hasLike}
                          time={post.time}
                          images={post.images}
                          tags={post.tagList}
                          key={post.id}/>
                ))
            }
        </div>
    );
}

const mapStateToProps = (state) => ({
    posts: postGetters.getPosts(state)
});

const mapDispatchToProps = (dispatch) => ({
    getPosts() {
        dispatch(postThunkCreators.getPosts());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleWrap);