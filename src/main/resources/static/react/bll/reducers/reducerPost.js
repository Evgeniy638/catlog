import apiPost from "../../api/apiPost";

const initialState = {
    posts: []
};

const CHANGE_POSTS = "CHANGE_POSTS";
const UPDATE_LIKES = "UPDATE_LIKES";

const reducerPost = (state=initialState, action) => {
    switch (action.type) {
        case UPDATE_LIKES:
            const posts = state.posts.map(post=>({
                ...post,
                hasLike: action.likesById.find(info => info.postId === post.id).hasLike
            }));

            return {
                ...state,
                posts
            }
        case CHANGE_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        default: {
            return state;
        }
    }
}

export default reducerPost;

export const postActionCreator = {
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
    }
}

export const postGetters = {
    getPosts(state) {
        return state.reducerPost.posts;
    }
}

export const postThunkCreators = {
    getPosts() {
        return async (dispatch) => {
            const posts = await apiPost.getAllPosts();
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
