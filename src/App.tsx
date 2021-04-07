import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'; 

function App() {
  return (
    <div className="App">
      <div className="navbar">
        <div className="brand"  style={{textAlign:'left', marginLeft:'20px'}}>
          <h4> LearnWithMe </h4>
        </div>
        <div className="login_signup" style={{textAlign:'right', marginRight:'20px'}}>

        </div>

      </div>
      <br/>
      <br/>
      <h1> Making Connections Makes Learning</h1>
      <h4> Students and teachers working together. </h4>
      <h4> Schedule meetups. Set goals. Build success. </h4>
    </div>
  );
}

export default App;
