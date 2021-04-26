import apiUser from "../../api/apiUser";
import {loginActionCreators} from "./reducerLogin";

const initialState = {
    authorization: "",
    nickname: "",
    avatar: undefined
};

const LOGIN = "LOGIN";

const reducerUser = (state=initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                authorization: action.authorization,
                nickname: action.nickname,
                avatar: action.avatar
            }
        default: {
            return state;
        }
    }
}

export default reducerUser;

export const userActionCreator = {
    login(authorization, nickname, avatar) {
        return {
            type: LOGIN,
            authorization,
            nickname,
            avatar
        }
    }
}

export const userGetters = {
    getNickname(state) {
        return state.reducerUser.nickname;
    },

    getAuthorization(state) {
        return state.reducerUser.authorization;
    },

    getAvatar(state) {
        return state.reducerUser.avatar;
    }
}

export const userThunkCreators = {
    login(nickname, password) {
        return async (dispatch) => {
            const {authorization} = await apiUser.login(nickname, password);
            const avatar = await apiUser.getImage(nickname);
            dispatch(userActionCreator.login(authorization, nickname, avatar));
            dispatch(loginActionCreators.close());
        }
    },

    registration(nickname, password, avatar) {
        return async (dispatch) => {
            const {authorization} = await apiUser
                .registration(nickname, password, avatar);
            dispatch(userActionCreator.login(authorization, nickname, avatar));
            dispatch(loginActionCreators.close());
        }
    }
}
