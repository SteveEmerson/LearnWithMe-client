import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';

type SplashProps = {
  setAppState: Function
}


class Splash extends React.Component<SplashProps, {}> {

  handleLogout = () :void => {
    console.log("got here")
    localStorage.removeItem('sessionToken')
    this.props.setAppState(
      {
        role: "",
        displayName: "",
        userId: 0,
        partnerList: [],
        availability: {temp:""}
      }
    )
  }

  render(){
    return (
      <div className="App">
        <Router>
          <div className="navbar" style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
              <div className='brand' style={{marginLeft:'40px'}}>
                <Link to='/'><h4> LearnWithMe </h4></Link>
              </div>
              <div className='enter' style={{marginRight:'40px'}}>
                <Link to='/login'><h4> Login </h4></Link>
                <Link to='/signup'><h4> Signup </h4></Link>
                <button onClick={this.handleLogout}>Logout</button>
              </div>
          </div>
          <br/>
          <br/>
          <Switch>
            <Route exact path='/'><Home /></Route>
            <Route exact path='/login'><Login setAppState={this.props.setAppState}/></Route>
            <Route exact path='/signup'><Signup setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <hr/>
        <div className='footer'> <p>&copy; 2021 LearnWithMe All rights reserved.</p></div>
      </div>
    );
  }
}

export default Splash;
