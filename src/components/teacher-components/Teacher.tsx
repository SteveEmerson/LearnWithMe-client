import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UpdateSettings from '../settings-components/UpdateSettings'
import TeacherStudentView from './TeacherStudentView';

type TeacherProps = {
  currUser: User
  setAppState: Function
}

type User = {
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability?: {temp?:any}
}
class Teacher extends React.Component<TeacherProps, {}> {

  handleLogout = () :void => {
    localStorage.removeItem('sessionToken')
    this.props.setAppState(
      {
        role: "",
        displayName: "",
        userId: 0,
        partnerList: [],
        availability: {temp:{}}
      }
    )
  }

  render() {
    return(
      <div>
        <h1> Teacher </h1>
        <Router>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Link to='/'><h4>LearnWithMe</h4></Link>
            <h4><button onClick={this.handleLogout}>Logout</button></h4>
            <Link to='/settings'><h4>Settings</h4></Link>
          </div>
          <Switch>
            <Route exact path='/'><TeacherStudentView /></Route>
            <Route exact path='/settings'><UpdateSettings role={this.props.currUser.role} userId={this.props.currUser.userId} setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Teacher;