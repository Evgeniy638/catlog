import apiPost from "../../api/apiPost";
import Post from "../../components/ArticleWrap/Post/Post";
import React from "react";

const initialState = {
    posts: [
        {
            id: 1,
            text: "text",
            authorNickname: "nick",
            countLikes: 1,
            countComments: 2,
            hasLike: false,
            time: 0,
            images: [],
            tags: [
                {
                    name: "tag"
                }
            ],
            comments: [
                {
                    id: 12,
                    text: "com",
                    authorNickname: "nick",
                    postId: 1,
                    hasAnswers: true,
                    replies: [
                        {
                            id: 13,
                            text: "reply",
                            authorNickname: "nick",
                            postId: 1,
                        }
                    ]
                }
                ]
        }
        ]
};

const CLEAN_POSTS = "CLEAN_POSTS";
const CHANGE_POSTS = "CHANGE_POSTS";
const UPDATE_LIKES = "UPDATE_LIKES";
const CHANGE_COUNT_LIKES = "CHANGE_COUNT_LIKES";
const UPDATE_NEW_POSTS = "UPDATE_NEW_POSTS";

const reducerPost = (state=initialState, action) => {
    switch (action.type) {
        case CLEAN_POSTS:
            return {
                ...state,
                posts: []
            }
        case UPDATE_NEW_POSTS:
            return {
                ...state,
                posts: [action.post, ...state.posts]
            }
        case CHANGE_COUNT_LIKES:
            const newPosts = state.posts.map(p =>
                p.id === action.postId
                    ?{
                        ...p,
                        countLikes: action.countLikes
                    }
                    :p
            );

            return {
                ...state,
                posts: newPosts
            }
        case UPDATE_LIKES:
            const posts = state.posts.map(post=>{
                const info = action.likesById.find(info => info.postId === post.id);
                const hasLike = info !== undefined ?info.hasLike :post.hasLike
                return {
                    ...post,
                    hasLike
                }
            });

            return {
                ...state,
                posts
            }
        case CHANGE_POSTS:
            return {
                ...state,
                posts: [...state.posts, ...action.posts]
            }
        default: {
            return state;
        }
    }
}

export default reducerPost;

export const postActionCreator = {
    cleanPosts() {
        return {
            type: CLEAN_POSTS
        }
    },

    changePosts(posts) {
        return {
            type: CHANGE_POSTS,
            posts
        }
    },

    getLikesInfo(likesById) {
        return {
            type: UPDATE_LIKES,
            likesById
        }
    },

    changeCountLikes(countLikes, postId) {
        return {
            type: CHANGE_COUNT_LIKES,
            countLikes,
            postId
        }
    },

    updateNewPosts(post){
        return {
            type: UPDATE_NEW_POSTS,
            post
        }
    }
}

export const postGetters = {
    getPosts(state) {
        return state.reducerPost.posts;
    }
}

export const postThunkCreators = {
    getPosts(tags) {
        return async (dispatch) => {
            const posts = tags
                ?await apiPost.findPostsByTags(tags)
                :await apiPost.getAllPosts();
            dispatch(postActionCreator.changePosts(posts));
        }
    },

    getLikesInfo(authorization, postsIds) {
        return async (dispatch) => {
            const likesById = await apiPost.getLikesInfo(authorization, postsIds);
            dispatch(postActionCreator.getLikesInfo(likesById));
        }
    }
}
