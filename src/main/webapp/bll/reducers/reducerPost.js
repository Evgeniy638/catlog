import apiPost from "../../api/apiPost";
import Post from "../../components/ArticleWrap/Post/Post";
import React from "react";
import apiUser from "../../api/apiUser";
import {LIMIT_POSTS} from "../../util/constants";

const initialState = {
    sinceId: -1,
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
                    headCommentId: 12
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
const UPDATE_COMMENTS = "UPDATE_COMMENTS";
const ADD_IMAGES = "ADD_IMAGES";
const ADD_INFO_ABOUT_COMMENTS_AND_LIKES = "ADD_INFO_ABOUT_COMMENTS_AND_LIKES";
const ADD_AVATAR = "AVATAR";
const ADD_NEW_COMMENT = "ADD_NEW_COMMENT";
const CHANGE_SINCE_ID = "CHANGE_SINCE_ID";
const DELETE_POST = "DELETE_POST";


const reducerPost = (state=initialState, action) => {
    switch (action.type) {
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.postId)
            };
        case CHANGE_SINCE_ID:
            return {
                ...state,
                sinceId: action.sinceId
            }
        case ADD_NEW_COMMENT:
            const newStatePosts = state.posts.map(p => {
                if (p.id !== action.comment.postId) {
                    return p;
                }

                return {
                    ...p,
                    countComments: p.countComments + 1
                }
            });

            if (!action.comment.headCommentId) {
                return {
                    ...state,
                    posts: newStatePosts,
                    comments: [...state.comments, action.comment]
                };
            }

            return {
                ...state,
                posts: newStatePosts,
                comments: state.comments.map(c => {
                    if (c.id !== action.comment.headCommentId) {
                        return c;
                    }

                    return {
                        ...c,
                        hasAnswers: true,
                        replies: [
                            action.comment,
                            ...c.replies
                        ]
                    }
                })
            }
        case ADD_AVATAR:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id !== action.postId) {
                        return post;
                    }

                    return {
                        ...post,
                        avatar: action.avatar
                    }
                })
            };
        case ADD_INFO_ABOUT_COMMENTS_AND_LIKES:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id !== action.postId) {
                        return post;
                    }

                    return {
                        ...post,
                        countLikes: action.countLikes,
                        countComments: action. countComments,
                        hasLike: action.hasLike
                    }
                })
            };
        case ADD_IMAGES:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id !== action.postId) {
                        return post;
                    }

                    return {
                        ...post,
                        images: action.images
                    }
                })
            };

        case UPDATE_COMMENTS:
            return {
                ...state,
                comments: [...action.comments, ...state.comments.filter((c) => c.postId !== action.postId)]
            };
        case CLEAN_POSTS:
            return {
                ...state,
                posts: []
            };
        case UPDATE_NEW_POSTS:
            return {
                ...state,
                posts: [action.post, ...state.posts]
            };
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
            };
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
            };
        case CHANGE_POSTS:
            return {
                ...state,
                posts: [...state.posts, ...action.posts]
            };
        default: {
            return state;
        }
    }
};

export default reducerPost;

export const postActionCreator = {
    changeSinceId(sinceId) {
        return {
            type: CHANGE_SINCE_ID,
            sinceId
        }
    },

    addAvatar(postId, avatar) {
        return {
            type: ADD_AVATAR,
            postId,
            avatar
        }
    },

    getInfoAboutCommentsAndLikes(info) {
        return {
            type: ADD_INFO_ABOUT_COMMENTS_AND_LIKES,
            ...info
        }
    },

    addImages(postId, images) {
        return {
            type: ADD_IMAGES,
            postId,
            images
        }
    },

    cleanPosts() {
        console.log("CLEAN")
        return {
            type: CLEAN_POSTS
        }
    },

    changePosts(posts) {
        console.log("ADD NEW POSTS")
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
    },

    updateComments(comments, postId){
        return {
            type: UPDATE_COMMENTS,
            comments,
            postId
        }
    },

    addNewComment(comment) {
        return {
            type: ADD_NEW_COMMENT,
            comment
        }
    },

    deletePost(postId) {
        return {
            type: DELETE_POST,
            postId
        }
    }
}

export const postGetters = {
    getPosts(state) {
        return state.reducerPost.posts;
    },

    getComments(state) {
        return state.reducerPost.comments;
    },

    getSinceId(state) {
        return state.reducerPost.sinceId;
    }
}

export const postThunkCreators = {
    getPosts(authorization,
             sinceId,
             isAllClean=true,
             options = {tags: undefined, nickname: undefined},
             callback = () => {}) {
        return async (dispatch) => {
            if (isAllClean) {
                dispatch(postActionCreator.cleanPosts());
                dispatch(postActionCreator.changeSinceId(-1));
            }

            let posts;

            if (options.tags !== undefined) {
                posts = await apiPost.findPostsByTags(options.tags, sinceId);
            } else if (options.nickname) {
                posts = await apiPost.findPostsByNickname(options.nickname, sinceId);
            } else {
                posts = await apiPost.getAllPosts(sinceId);
            }

            if (isAllClean) {
                dispatch(postActionCreator.cleanPosts());
            }

            dispatch(postActionCreator.changePosts(posts));

            const newSinceId = Math.min(...posts.map(p => p.id));
            dispatch(postActionCreator.changeSinceId(newSinceId));

            if (posts.length === LIMIT_POSTS) {
                callback(newSinceId);
            }

            posts.forEach((post) => {
                (async () => {
                    const images = await apiPost.getImagesByPostId(post.id);
                    dispatch(postActionCreator.addImages(post.id, images));

                    const avatar = await apiUser.getImage(post.authorNickname);
                    dispatch(postActionCreator.addAvatar(post.id, avatar));

                    const info = await apiPost.getInfoAboutCommentsAndLikes(post.id, authorization);
                    dispatch(postActionCreator.getInfoAboutCommentsAndLikes(info));
                })();
            });
        }
    },

    getLikesInfo(authorization, postsIds) {
        return async (dispatch) => {
            const likesById = await apiPost.getLikesInfo(authorization, postsIds);
            dispatch(postActionCreator.getLikesInfo(likesById));
        }
    },

    getComments(postId) {
        return async (dispatch) => {
            const comments = await apiPost.getCommentsByPostId(postId);
            dispatch(postActionCreator.updateComments(comments, postId));
        }
    },

    deletePost(postId) {
        return async (dispatch) => {
            await apiPost.deletePost(postId);
            dispatch(postActionCreator.deletePost(postId));
        }
    }
}
