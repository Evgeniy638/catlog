import apiPost from "../../api/apiPost";
import Post from "../../components/ArticleWrap/Post/Post";
import React from "react";
import apiUser from "../../api/apiUser";

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
const ADD_NEW_COOMMENT = "ADD_NEW_COMMENT";
const ADD_COMMENT_REPLY = "ADD_COMMENT_REPLY";


const reducerPost = (state=initialState, action) => {
    switch (action.type) {

        case ADD_NEW_COOMMENT:
            return {
              ...state,
              comments: [...state.comments, action.comment]
            };
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
        type: ADD_NEW_COOMMENT,
        comment
      }
    }
  
}

export const postGetters = {
    getPosts(state) {
        return state.reducerPost.posts;
    },

    getComments(state) {
        return state.reducerPost.comments;
    }
}

export const postThunkCreators = {
    getPosts(authorization, tags) {
        return async (dispatch) => {
            const posts = tags
                ?await apiPost.findPostsByTags(tags)
                :await apiPost.getAllPosts();
            dispatch(postActionCreator.changePosts(posts));

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
    }
}
