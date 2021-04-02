import React, {useEffect, useState} from "react";
import './App.css';
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";

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
            <Header/>
            <Login/>
            <h1>Привет React</h1>
            <p>{posts.toString()}</p>
        </div>
    );
}

export default App;
