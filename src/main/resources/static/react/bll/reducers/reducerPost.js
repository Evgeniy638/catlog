import apiPost from "../../api/apiPost";

const initialState = {
    posts: []
};

const CHANGE_POSTS = "CHANGE_POSTS";

const reducerPost = (state=initialState, action) => {
    switch (action.type) {
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
    }
}
