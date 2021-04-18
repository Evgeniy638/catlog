import React from "react";
import './App.css';
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Content from "./components/Content/Content";

const App = () => {
    return (
        <div className="App">
            <Header/>
            <Login/>
            <Content/>
        </div>
    );
}

export default App;
