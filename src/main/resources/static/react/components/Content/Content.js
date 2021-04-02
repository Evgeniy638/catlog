import React from "react";
import "./content.css";
import SubmitBox from "../SubmitBox/SubmitBox";
import ArticleWrap from "../ArticleWrap/ArticleWrap";

const Content = () => {
    return (
        <section className="content">
            <SubmitBox/>
            <ArticleWrap/>
        </section>
    );
}

export default Content;
