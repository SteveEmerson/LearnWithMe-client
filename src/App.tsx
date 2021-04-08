import * as React from 'react';
import './App.css';
import Splash from './components/splash-components/Splash'

type User = {
  role: string
  displayName: string
  userId: number
  partnerList: number[]
  availability?: {temp: any}
}

type AppState = {
  user: User
}

class App extends React.Component<{}, AppState> {
  constructor(){
    super({});
    this.state = {
      user: {
        role: "",
        displayName: "",
        userId: 0,
        partnerList: [],
        availability: {temp:""}
      }
    }
  }

  handler = (currUser: User) :void => {
    console.log(currUser);
    this.setState(() => {
    return  {user: currUser}
    })
    console.log(this.state)
  }

  render() {
    return (
      <div className="App">
        <Splash setAppState={this.handler}/>
        <div>
          <h1>Current App State</h1>
          <p>displayName: {this.state.user.displayName}</p>
          <p>role: {this.state.user.role}</p>
          <p>userId: {this.state.user.userId}</p>
          <p>sessionToken: {localStorage.getItem('sessionToken')}</p>
          {/* <p>partnerList: {this.state.user.partnerList}</p> */}
          {/* <p>availability: {this.state.user.availability}</p> */}
        </div>
      </div>
    );
  }
}

export default App;
