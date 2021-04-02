import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import reducerUser from "./reducers/reducerUser";
import reducerLogin from "./reducers/reducerLogin";

const reducer = combineReducers({
    reducerUser,
    reducerLogin
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;