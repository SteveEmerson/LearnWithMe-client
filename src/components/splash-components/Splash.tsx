import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import logo from '../../assets/logo/Logo.png'

type SplashProps = {
  setAppState: Function
}

type SplashState = {
  navBarOpen: boolean
}

class Splash extends React.Component<SplashProps, SplashState> {
  constructor(props: SplashProps){
    super(props);
    this.state = {
      navBarOpen: false
    }
  }

  render(){
    return (
      <div className="bg-black text-gray-50 h-screen">
        <Router>

          {/* NAV elements adapted from  https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/navbars*/}

          <nav className="fixed w-screen flex flex-wrap items-center justify-between py-3 bg-black mb-3">
            <div className="container px-4 mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                
                <Link to='/home' >
                    <img className="max-h-12" src={logo} alt=""/>  
                </Link>
                
                <button
                  className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                  type="button"
                  onClick={() => this.setState({navBarOpen: !this.state.navBarOpen})}
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
              <div
                className={
                  "lg:flex flex-grow items-center" +
                  (this.state.navBarOpen ? " flex" : " hidden")
                }
                // id="example-navbar-danger"
              >
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-4">
                  <li className="nav-item">

                    <Link to='/login' >
                      <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white rounded hover:opacity-75">Login</button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/signup' >
                      <button className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white bg-blue-500 rounded hover:opacity-75" style={{backgroundColor:"blue"}}>SignUp</button>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/* NAV END ATTRIBUTION */}
          <Switch>
            <Route exact path='/'><Redirect to='/home' /></Route>
            <Route exact path='/home'><Home /></Route>
            <Route exact path='/login'><Login setAppState={this.props.setAppState}/></Route>
            <Route exact path='/signup'><Signup setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Splash;
