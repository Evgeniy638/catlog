export const initialState = {
    isOpenLogin: false,
};

const TOGGLE_OPEN_LOGIN = 'TOGGLE_OPEN_LOGIN';
const CLOSE_LOGIN = 'CLOSE_LOGIN';

export default function reducerLogin (state=initialState, action) {
    switch (action.type) {
        case CLOSE_LOGIN:
            return Object.assign(state, { isOpenLogin: false });
        case TOGGLE_OPEN_LOGIN: {
            return Object.assign(state, { isOpenLogin: !state.isOpenLogin });
        }
        default: {
            return state;
        }
    }
}

export const loginActionCreators = {
    toggleOpen() {
        return {type: TOGGLE_OPEN_LOGIN};
    },

    close() {
        return {type: CLOSE_LOGIN};
    }
};

export const loginGetters = {
    getIsOpenLogin(state) {
        return state.reducerLogin.isOpenLogin;
    }
};
