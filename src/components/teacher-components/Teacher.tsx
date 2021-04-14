import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UpdateSettings from '../settings-components/UpdateSettings'
import TeacherStudentView from './TeacherStudentView';
import TeacherMeetingView from './TeacherMeetingView';

type TeacherProps = {
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

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
}

type Goal = {
  id: number
  description: string
  targetDate: Date
  createdAt: Date
  updatedAt: Date
  studentId: number
  teacherId: number | null
}

type TeacherState = {
  meetings: Array<Meeting>
  goals: Array<Goal>
}

class Teacher extends React.Component<TeacherProps, TeacherState> {
  constructor(props: TeacherProps){
    super(props);
    this.state = {
      meetings: [],
      goals: []
    }
  }

  componentDidMount(){
    this.getMeetings();
    this.getGoals();
  }

  getMeetings = () => {
    const url: string = `http://localhost:3000/meeting/teacher_get`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.currUser.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Array<Meeting>) => {
        console.log(data);
        this.setState({meetings: data})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  getGoals = () => {
    const url: string = `http://localhost:3000/goal/teacher_get`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.currUser.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Array<Goal>) => {
        console.log(data);
        this.setState({goals: data})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

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
    //console.log(this.props.currUser)
    return(
      <div style={{textAlign:'left', marginLeft:'50px'}}>
        <h1> Teacher </h1>
        <Router>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Link to='/teacher-student'><h4>View Students</h4></Link>
            <Link to='/teacher-meeting'><h4>View Meetings</h4></Link>
            <h4><button onClick={this.handleLogout}>Logout</button></h4>
            <Link to='/settings'><h4>Settings</h4></Link>
          </div>
          <Switch>
            <Route exact path='/teacher-student'>
              <TeacherStudentView 
                user={this.props.currUser} 
                meetings={this.state.meetings}
                goals={this.state.goals}
              />
            </Route>
            <Route exact path='/teacher-meeting'><TeacherMeetingView user={this.props.currUser}/></Route>
            <Route exact path='/settings'><UpdateSettings user={this.props.currUser} setAppState={this.props.setAppState}/></Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Teacher;