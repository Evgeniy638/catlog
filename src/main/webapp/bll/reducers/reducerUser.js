import apiUser from "../../api/apiUser";
import {loginActionCreators} from "./reducerLogin";

const initialState = {
    authorization: "",
    nickname: ""
};

const LOGIN = "LOGIN"

const reducerUser = (state=initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                authorization: action.authorization,
                nickname: action.nickname
            }
        default: {
            return state;
        }
    }
}

export default reducerUser;

export const userActionCreator = {
    login(authorization, nickname) {
        return {
            type: LOGIN,
            authorization,
            nickname
        }
    }
}

export const userGetters = {
    getNickname(state) {
        return state.reducerUser.nickname;
    },

    getAuthorization(state) {
        return state.reducerUser.authorization;
    }
}

export const userThunkCreators = {
    login(nickname, password) {
        return async (dispatch) => {
            const {authorization} = await apiUser.login(nickname, password);
            dispatch(userActionCreator.login(authorization, nickname));
            dispatch(loginActionCreators.close());
        }
    },

    registration(nickname, password) {
        return async (dispatch) => {
            const {authorization} = await apiUser
                .registration(registrationForm.elements.nickname.value, password);
            dispatch(userActionCreator.login(authorization, nickname));
            dispatch(loginActionCreators.close());
        }
    }
}
