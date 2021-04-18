import React from "react";
import "./content.css";
import {Route, withRouter } from "react-router-dom";
import Home from "../Home/Home";

const Content = (props) => {
    return (
        <section className="content">
            <Route path={["/home/:tags", "/home"]} component={Home}/>
        </section>
    );
}

export default withRouter(Content);
