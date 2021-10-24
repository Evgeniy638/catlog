import apiUser from '../../api/apiUser';
import {loginActionCreators} from './reducerLogin';
import {keysStorage} from '../../util/constants';

const initialState = {
    authorization: '',
    nickname: '',
    avatar: undefined,
    loginError: '',
    registrationError: ''
};

const LOGIN = 'LOGIN';
const LOGIN_ERROR = 'LOGIN_ERROR';
const REGISTRATION_ERROR = 'REGISTRATION_ERROR';
const LOGOUT = 'LOGOUT';

const reducerUser = (state=initialState, action) => {
    switch (action.type) {
        case LOGOUT:
            return {
                ...state,
                avatar: initialState.avatar,
                nickname: initialState.nickname,
                authorization: initialState.authorization
            };
        case REGISTRATION_ERROR:
            return {
                ...state,
                registrationError: action.registrationError
            };
        case LOGIN_ERROR:
            return {
                ...state,
                loginError: action.loginError
            };
        case LOGIN:
            return {
                ...state,
                authorization: action.authorization,
                nickname: action.nickname,
                avatar: action.avatar
            };
        default: {
            return state;
        }
    }
};

export default reducerUser;

export const userActionCreator = {
    changeLoginError (loginError) {
        return {
            type: LOGIN_ERROR,
            loginError
        };
    },
    changeRegistrationError (registrationError) {
        return {
            type: REGISTRATION_ERROR,
            registrationError
        };
    },
    login(authorization, nickname, avatar) {
        return {
            type: LOGIN,
            authorization,
            nickname,
            avatar
        };
    },
    logout() {
        return {type: LOGOUT};
    }
};

export const userGetters = {
    getLoginError(state) {
        return state.reducerUser.loginError;
    },
    getRegistrationError(state) {
        return state.reducerUser.registrationError;
    },
    getNickname(state) {
        return state.reducerUser.nickname;
    },

    getAuthorization(state) {
        return state.reducerUser.authorization;
    },

    getAvatar(state) {
        return state.reducerUser.avatar;
    }
};

export const userThunkCreators = {
    loginByLocalStorage() {
        return (dispatch) => {
            const authorization = localStorage.getItem(keysStorage.AUTHORIZATION);
            const nickname = localStorage.getItem(keysStorage.NICKNAME);
            const avatar = localStorage.getItem(keysStorage.AVATAR);
            dispatch(userActionCreator.login(authorization, nickname, avatar));
        };
    },
    logout() {
        return (dispatch) => {
            dispatch(userActionCreator.logout());
            localStorage.removeItem(keysStorage.AVATAR);
            localStorage.removeItem(keysStorage.NICKNAME);
            localStorage.removeItem(keysStorage.AUTHORIZATION);
        };
    },
    login(nickname, password) {
        return async (dispatch) => {
            try {
                const {authorization} = await apiUser.login(nickname, password);
                const avatar = await apiUser.getImage(nickname);
                dispatch(userActionCreator.login(authorization, nickname, avatar));
                dispatch(loginActionCreators.close());
                localStorage.setItem(keysStorage.AUTHORIZATION, authorization);
                localStorage.setItem(keysStorage.NICKNAME, nickname);
                localStorage.setItem(keysStorage.AVATAR, avatar);
            } catch (e) {
                dispatch(userActionCreator.changeLoginError(e.message));
            }
        };
    },

    registration(nickname, password, avatar) {
        return async (dispatch) => {
            try {
                const {authorization} = await apiUser
                    .registration(nickname, password, avatar);
                dispatch(userActionCreator.login(authorization, nickname, avatar));
                dispatch(loginActionCreators.close());
                localStorage.setItem(keysStorage.AUTHORIZATION, authorization);
                localStorage.setItem(keysStorage.NICKNAME, nickname);
                localStorage.setItem(keysStorage.AVATAR, avatar);
            } catch (e) {
                dispatch(userActionCreator.changeRegistrationError(e.message));
            }
        };
    }
};
