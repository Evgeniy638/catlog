import React, {useLayoutEffect} from 'react';
import './App.css';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Content from './components/Content/Content';
import { Redirect, withRouter } from 'react-router-dom';
import {userThunkCreators} from './bll/reducers/reducerUser';
import {connect} from 'react-redux';
import {compose} from 'redux';

const App = (props) => {
    useLayoutEffect(() => {
        props.loginByLocalStorage();
    }, []);

    if (props.location.pathname === '/') {
        return <Redirect to={'/home'}/>;
    }

    return (
        <div className="App">
            <Header/>
            <Login/>
            <Content/>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    loginByLocalStorage() {
        dispatch(userThunkCreators.loginByLocalStorage());
    }
});

export default compose(
    withRouter,
    connect(null, mapDispatchToProps)
)(App);
