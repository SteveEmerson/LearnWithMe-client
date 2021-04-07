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
      sessionToken: "",
      user: {
        role: "",
        displayName: "",
        userId: 0
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Splash setAppState={this.setState}/>
      </div>
    );
  }
}

export default App;
