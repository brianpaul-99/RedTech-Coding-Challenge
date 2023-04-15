import React from "react";
import Toolbar from "./toolbar";
import "./App.css";
import logo from "./assets/red-tech-logo.png";
import Home from "./Pages/Home";
function App() {
  return (
    <div className="App">
      <header>
        <div className="titleSection">
          <img src={logo} alt="Logo" />
          <h2 className="title">Home</h2>
        </div>
        <div>
          <Toolbar />
        </div>
      </header>
      <body>
        <Home />
      </body>
    </div>
  );
}

export default App;
