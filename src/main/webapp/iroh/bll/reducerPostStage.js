export default `
const initialState = {
    sinceId: -1,
    posts: [
        {
            id: 1,
            text: 'text',
            authorNickname: 'nick',
            countLikes: 1,
            countComments: 2,
            hasLike: false,
            time: 0,
            images: [],
            tags: [
                {
                    name: 'tag'
                }
            ],
        }
        ],
    comments: [
        {
            id: 12,
            text: 'com',
            authorNickname: 'nick',
            postId: 1,
            hasAnswers: true,
            replies: [
                {
                    id: 13,
                    text: 'reply',
                    authorNickname: 'nick',
                    postId: 1,
                    headCommentId: 12
                }
            ]
        }
    ]
};

const CLEAN_POSTS = 'CLEAN_POSTS';
const CHANGE_POSTS = 'CHANGE_POSTS';
const UPDATE_LIKES = 'UPDATE_LIKES';
const CHANGE_COUNT_LIKES = 'CHANGE_COUNT_LIKES';
const UPDATE_NEW_POSTS = 'UPDATE_NEW_POSTS';
const UPDATE_COMMENTS = 'UPDATE_COMMENTS';
const ADD_IMAGES = 'ADD_IMAGES';
const ADD_INFO_ABOUT_COMMENTS_AND_LIKES = 'ADD_INFO_ABOUT_COMMENTS_AND_LIKES';
const ADD_AVATAR = 'AVATAR';
const ADD_NEW_COMMENT = 'ADD_NEW_COMMENT';
const CHANGE_SINCE_ID = 'CHANGE_SINCE_ID';
const DELETE_POST = 'DELETE_POST';


function reducerPost(state=initialState, action) {
    switch (action.type) {
        case ADD_AVATAR: {
            return Object.assign(
                state, 
            {
                posts: state.posts.map(post => {
                    if (post.id !== action.postId) {
                        return post;
                    }

                    return Object.assign(post, {
                        avatar: action.avatar
                    });
                })
            });
        }
        case CLEAN_POSTS:
            return Object.assign(state, { posts: []});
        case UPDATE_NEW_POSTS:
            const newPosts = Object.assign([], state.posts);
            newPosts.push(action.post);
            return Object.assign(state, { posts: newPosts});
        default: {
            return state;
        }
    }
}


let state = reducerPost(undefined, { type: 'INIT' });
state = reducerPost(state, { type: UPDATE_NEW_POSTS, post:
    {
        id: 2,
        text: 'Ещё один пост',
        authorNickname: 'Jon',
        countLikes: 1,
        countComments: 2,
        hasLike: false,
        time: 0,
        images: [],
        tags: [
            {
                name: 'tag'
            }
        ],
    }
});
//state = reducerPost(state, { type: ADD_AVATAR, postId: 2, avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/120px-Unofficial_JavaScript_logo_2.svg.png'});
//state = reducerPost(state, { type: CLEAN_POSTS });
`;
