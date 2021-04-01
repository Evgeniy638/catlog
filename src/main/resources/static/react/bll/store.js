import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import reducerUser from "./reducers/reducerUser";

const reducer = combineReducers({
    reducerUser
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;