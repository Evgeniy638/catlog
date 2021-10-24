export default `
const initialState = {
    isOpenLogin: false,
};

const TOGGLE_OPEN_LOGIN = 'TOGGLE_OPEN_LOGIN';
const CLOSE_LOGIN = 'CLOSE_LOGIN';

function reducerLogin (state=initialState, action) {
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

let state = reducerLogin(undefined, { type: 'INIT' }); //init;
state = reducerLogin(state, loginActionCreators.toggleOpen()); // open
reducerLogin(state, loginActionCreators.close()); // close`;
