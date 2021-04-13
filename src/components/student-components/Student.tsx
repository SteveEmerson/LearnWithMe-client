import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UpdateSettings from '../settings-components/UpdateSettings'

type StudentProps = {
  currUser: User
  setAppState: Function
}

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
}


class Student extends React.Component<StudentProps, {}> {
  
  handleLogout = () => {
    localStorage.removeItem('sessionToken')
    this.props.setAppState(
      {
        user: {
          email: "",
          role: "",
          displayName: "",
          userId: 0,
          partnerList: [],
          availability: {},
          sessionToken:""
        }
      }
    )
  }

  render() {
    return(
      <div style={{textAlign:'left', marginLeft:'50px'}}>
        <h1> Student </h1>
        <Router>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <h4>LearnWithMe</h4>
            <h4><button onClick={this.handleLogout}>Logout</button></h4>
            <Link to='/settings'><h4>Settings</h4></Link>
          </div>
          <Switch>
            <Route exact path='/settings'><UpdateSettings user={this.props.currUser} setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Student;