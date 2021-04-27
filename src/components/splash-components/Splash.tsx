import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';

type SplashProps = {
  setAppState: Function
}

class Splash extends React.Component<SplashProps, {}> {

  render(){
    return (
      <div className="text-gray-50">
        <Router>
          <div>
              <Link to='/home' ><h4 > (LOGO) </h4></Link>
              <Link to='/login'><h4> Login </h4></Link>
              <Link to='/signup'><h4> Signup </h4></Link>
          </div>
          <br/>
          <br/>
          <Switch>
            <Route exact path='/'><Redirect to='/home' /></Route>
            <Route exact path='/home'><Home /></Route>
            <Route exact path='/login'><Login setAppState={this.props.setAppState}/></Route>
            <Route exact path='/signup'><Signup setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
        <div> <p>&copy; 2021 LearnWithMe All rights reserved.</p></div>
      </div>
    );
  }
}

export default Splash;
