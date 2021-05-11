import * as React from 'react';

import Splash from './components/splash-components/Splash';
import Teacher from './components/teacher-components/Teacher';
import Student from './components/student-components/Student';
import Footer from './components/head_foot-components/Footer';

type User = {
  email: string
  role: string
  displayName: string
  userId: number
  partnerList: number[]
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
  sessionToken: string
}

type AppState = {
  user: User
}

class App extends React.Component<{}, AppState> {
  constructor(props: any){
    super(props);
    this.state = {
      user: {
        email:"",
        role: "",
        displayName: "",
        userId: 0,
        partnerList: [],
        availability: {
          mon: [],
          tue: [],
          wed: [],
          thu: [],
          fri: []
        },
        sessionToken: ""
       
      }
    }
    this.setState = this.setState.bind(this)
  }

  componentDidUpdate(){
  }

  render() {
    
    return (
      <div className="bg-splash-back">
        {this.state.user.role === "" && <Splash setAppState={this.setState}/>}
        {this.state.user.role === "teacher" && <Teacher currUser={this.state.user} setAppState={this.setState}/>}
        {this.state.user.role === "student" && <Student currUser={this.state.user} setAppState={this.setState}/>}
        <Footer/>
        {/* <div className="bg-white flex flex-row space-x-4">
          <h1 className="font-semibold" >Current App State</h1>
          <p>displayName: {this.state.user.displayName}</p>
          <p>email: {this.state.user.email}</p>
          <p>role: {this.state.user.role}</p>
          <p>userId: {this.state.user.userId}</p>
          <p>sessionToken: {this.state.user.sessionToken}</p>
          <p>partnerList: {this.state.user.partnerList}</p>
          <p>availability: {String(this.state.user.availability)}</p>
        </div> */}
      </div>
    );
  }
}

export default App;
