import React, {useEffect, useState} from "react";
import './App.css';

const App = () => {
    const [posts, setPosts] = useState({});

    useEffect( () => {
        (async () => {
            const responce = await fetch("/posts");
            setPosts(await responce.json());
        })();
    }, []);

    console.log(posts);

    return (
        <div className="App">
            <h1>Привет React</h1>
            <p>{posts.toString()}</p>
        </div>
    );
}

export default App;
