import React from 'react';
import { withRouter} from 'react-router-dom';
import SubmitBox from '../SubmitBox/SubmitBox';
import ArticleWrap from '../ArticleWrap/ArticleWrap';
import './Home.css';

const Home = (props) => {
    let tags = props.match.params.tags;
    tags = tags && tags.split('+');

    return (
        <>
            {tags && <h2 className="Home__title">Результаты поиска по {tags.join(' ')}</h2>}
            <SubmitBox/>
            <ArticleWrap tags={tags}/>
        </>
    );
};

export default withRouter(Home);
