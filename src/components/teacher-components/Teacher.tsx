import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
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

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  partners: number[]
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
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
  tasks: Array<Task>
  students: Array<Student>
  gotMeetings: boolean
  gotGoals: boolean
  gotTasks: boolean
  gotStudents: boolean
}

type Task = {
  id: number
  description: string
  completed: boolean
  createdAt: Date,
  updatedAt: Date,
  goalId: number,
  studentId: number,
  teacherId: number
}

type FetchStudentData = {
  id: number,
  email: string,
  passwordhash: string,
  name: string,
  teacherList: number[]
  role: string,
  availability: {},
  createdAt: string,
  updatedAt: string
}

class Teacher extends React.Component<TeacherProps, TeacherState> {
  constructor(props: TeacherProps){
    super(props);
    this.state = {
      meetings: [],
      goals: [],
      tasks: [],
      students: [],
      gotMeetings: false,
      gotGoals: false,
      gotTasks: false,
      gotStudents: false
    }
    this.setState = this.setState.bind(this);
  }

  componentDidMount(){
    this.getMeetings();
    this.getGoals();
    this.getTasks();
    this.getStudents();
   
  }



  getStudents = () => {
    const url: string = `http://localhost:3000/student/`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.currUser.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Array<FetchStudentData>) => {
        let allStudents: Array<Student> = 
        data.filter((partner:FetchStudentData) => {
          return this.props.currUser.partnerList.includes(partner.id)
        })
        .map((partner: FetchStudentData) => {
          return {
            id: partner.id, 
            displayName: partner.name, 
            email:partner.email, 
            availability:partner.availability,
            partners: partner.teacherList
          }
        } )
        this.setState({students: allStudents})
        this.setState({gotStudents: true})
        console.log(this.state.students)
       
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
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
        this.setState({meetings: data})
        this.setState({gotMeetings: true})
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
        this.setState({goals: data})
        this.setState({gotGoals: true})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  getTasks = () => {
    
    const url: string = `http://localhost:3000/task/teacher_get`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.currUser.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Array<Task>) => {
        console.log('GOT TO HERE IN NEW TASK SUBMIT')
        this.setState({tasks: data})
        this.setState({gotTasks: true})
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
      <div>
        <h1> Teacher </h1>
        <Router>
          <div >
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
                tasks={this.state.tasks}
                students={this.state.students}
                getMeetings={this.getMeetings}
                getGoals={this.getGoals}
                getTasks={this.getTasks}
              />
            </Route>
            <Route exact path='/teacher-meeting'>
              <TeacherMeetingView 
                user={this.props.currUser}
                meetings={this.state.meetings}
                getMeetings={this.getMeetings}
                setTeacherState={this.setState}
              />
            </Route>
            <Route exact path='/settings'><UpdateSettings user={this.props.currUser} setAppState={this.props.setAppState}/></Route>
          </Switch>
          {this.state.gotMeetings && this.state.gotGoals && this.state.gotTasks && this.state.gotStudents
          ? <Redirect to="/teacher-student"/> 
          : null}
        </Router>
      </div>
    )
  }
}

export default Teacher;