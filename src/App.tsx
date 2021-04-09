import * as React from 'react';
import './App.css';
import Splash from './components/splash-components/Splash';
import Teacher from './components/teacher-components/Teacher';
import Student from './components/student-components/Student';

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
        availability: {temp: {}}
       
      }
    }
  }

  handler = (logoutUser: User) :void => {
    console.log(logoutUser);
    this.setState(() => {
    return  {user: logoutUser}
    })
    console.log(this.state)
  }

  render() {
    return (
      <div className="App">
        {
        this.state.user.role === "" ? 
          <Splash setAppState={this.handler}/> 
        :
        this.state.user.role === "teacher" ? 
          <Teacher currUser={this.state.user} setAppState={this.handler}/> 
        :
          <Student currUser={this.state.user} setAppState={this.handler}/>
        }
        
        
        
        {/* <div>
          <h1>Current App State</h1>
          <p>displayName: {this.state.user.displayName}</p>
          <p>role: {this.state.user.role}</p>
          <p>userId: {this.state.user.userId}</p>
          <p>sessionToken: {localStorage.getItem('sessionToken')}</p>
        </div> */}
      </div>
    );
  }
}

export default App;
