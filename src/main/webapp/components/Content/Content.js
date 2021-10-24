import React from 'react';
import './content.css';
import {Route} from 'react-router-dom';
import Home from '../Home/Home';
import UserProfile from '../UserProfile/UserProfile';
import SearchInput from '../Header/SearchInput/SearchInput';

const Content = (props) => {
    return (
        <section className="content">
            <div className="content__element content__element_visible-only-mobile">
                <SearchInput/>
            </div>
            <Route path={['/home/:tags', '/home']} component={Home}/>
            <Route path={['/user/:nickname']} component={UserProfile}/>
        </section>
    );
};

export default Content;
