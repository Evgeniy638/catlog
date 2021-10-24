import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducerUser from './reducers/reducerUser';
import reducerLogin from './reducers/reducerLogin';
import reducerPost from './reducers/reducerPost';

const reducer = combineReducers({
    reducerUser,
    reducerLogin,
    reducerPost
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;