import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import UpdateSettings from '../settings-components/UpdateSettings'
import TeacherStudentView from './TeacherStudentView';
import TeacherMeetingView from './TeacherMeetingView';
import history from '../../history-module/history'
import logo from '../../assets/logo/Logo.png'
import cog from '../../assets/settings-cogwheel-button.svg'
import APIURL from '../../helpers/environment'

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
  childComp: string
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
      gotStudents: false,
      childComp: "students"
    }
    this.setState = this.setState.bind(this);
  }

  componentDidMount(){
    this.getMeetings();
    this.getGoals();
    this.getTasks();
    this.getStudents();
   
  }

  componentDidUpdate(prevProps: TeacherProps, prevState: TeacherState) {
    if(this.checkPartnerChanged(prevProps.currUser.partnerList, this.props.currUser.partnerList)){
      console.log("partners changed")
      this.getStudents()
    }else{
      console.log("partners did not change")
    }
  }

  checkPartnerChanged = (pl1: number[], pl2: number[]) => {
    let changed: boolean = false;

    if(pl1.length !== pl2.length) {changed = true}
    
    pl1.forEach((id) => {
      if(!pl2.includes(id)) {changed = true}
    })

    return changed
  }

  getStudents = () => {
    const url: string = `${APIURL}/student/`
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
       
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  getMeetings = () => {
    const url: string = `${APIURL}/meeting/teacher_get`
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
    const url: string = `${APIURL}/goal/teacher_get`
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
    
    const url: string = `${APIURL}/task/teacher_get`
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
        this.setState({tasks: data})
        this.setState({gotTasks: true})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }


  handleLogout = () => {
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
    this.setState({childComp: ""})
    history.push('/home');
  }

  render() {

    return(
      <div className="bg-black text-gray-50 min-h-screen">
        <Router>

          {/* NAV elements adapted from  www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/navbars*/}

          <nav className="fixed w-screen flex flex-wrap items-center justify-between py-3 bg-black mb-3">
            <div className="container px-4 mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <img className="max-h-12" src={logo} alt=""/>  
              </div>

              <div className= "lg:flex flex-grow items-center">
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-4">
                  <li className="nav-item">

                    <Link to='/teacher-student' >
                      <p 
                        className={`px-3 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white rounded hover:opacity-75 ${this.state.childComp==="students"?"underline":null}`}
                        onClick={() => this.setState({childComp: "students"})}
                      >
                        Students
                      </p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/teacher-meeting' >
                      <p 
                        className={`px-3 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white rounded hover:opacity-75 ${this.state.childComp==="meetings"?"underline":null}`}
                        onClick={() => this.setState({childComp: "meetings"})}
                      >
                        Meetings
                      </p>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="lg:flex flex-grow items-center lg:justify-end space-x-5">
                <button 
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white bg-gray-500 rounded hover:opacity-75" 
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
                <Link to='/settings'>
                  <img 
                    className="max-h-6" 
                    style={{filter: "invert(43%) sepia(9%) saturate(543%) hue-rotate(182deg) brightness(101%) contrast(97%)"}} 
                    onClick={() => this.setState({childComp: ""})}
                    src={cog} 
                    alt="cog"
                  />
                </Link>
              </div>

            </div>
          </nav>
          {/* NAV END ATTRIBUTION */}
          
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