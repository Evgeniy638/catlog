import React from "react";
import "./content.css";
import {Route} from "react-router-dom";
import Home from "../Home/Home";
import UserProfile from "../UserProfile/UserProfile";

const Content = (props) => {
    return (
        <section className="content">
            <Route path={["/home/:tags", "/home"]} component={Home}/>
            <Route path={["/user/:nickname"]} component={UserProfile}/>
        </section>
    );
}

export default Content;
