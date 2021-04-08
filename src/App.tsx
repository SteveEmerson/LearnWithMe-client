import * as React from 'react';
import './App.css';
import Splash from './components/splash-components/Splash'

type User = {
  role: string
  displayName: string
  userId: number
}

type AppState = {
  sessionToken: string
  user: User
}

class App extends React.Component<{}, AppState> {
  constructor(){
    super({});
    this.state = {
      sessionToken: "initial token",
      user: {
        role: "",
        displayName: "",
        userId: 0
      }
    }
  }

  handler = (token: string, currUser: User) :void => {
    console.log(token);
    console.log(currUser);
    this.setState(() => {
    return  {sessionToken: token, user: currUser}
    })
    console.log(this.state)
  }

  render() {
    return (
      <div className="App">
        <Splash setAppState={this.handler}/>
        <div>
          <h1>Current App State</h1>
          <p>token: {this.state.sessionToken}</p>
          <p>displayName: {this.state.user.displayName}</p>
          <p>role: {this.state.user.role}</p>
          <p>userId: {this.state.user.userId}</p>
        </div>
      </div>
    );
  }
}

export default App;
