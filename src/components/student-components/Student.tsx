import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import UpdateSettings from '../settings-components/UpdateSettings'
import StudentMeetingView from './StudentMeetingView';
import history from '../../history-module/history';
import logo from '../../assets/logo/Logo.png';
import cog from '../../assets/settings-cogwheel-button.svg';
import APIURL from '../../helpers/environment'

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
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
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

type StudentState = {
  meetings: Array<Meeting>
  goals: Array<Goal>
  tasks: Array<Task>
  gotMeetings: boolean
  gotGoals: boolean
  gotTasks: boolean
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

class Student extends React.Component<StudentProps, StudentState> {
  constructor(props: StudentProps){
    super(props);
    this.state = {
      meetings: [],
      goals: [],
      tasks: [],
      gotMeetings: false,
      gotGoals: false,
      gotTasks: false,
      childComp: "gm"
    }
    this.setState = this.setState.bind(this)
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
          availability: {
            mon: [],
            tue: [],
            wed: [],
            thu: [],
            fri: []
          },
          sessionToken:""
        }
      }
    )
    history.push('/home');
  }

  componentDidMount(){
    this.getMeetings();
    this.getGoals();
    this.getTasks();
  }

  getMeetings = () => {
    const url: string = `${APIURL}/meeting/student_get`
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
    console.log("Get Goals")
    const url: string = `${APIURL}/goal/student_get`
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
    const url: string = `${APIURL}/task/student_get`
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


  render() {
    // console.log(this.state.gotMeetings, this.state.gotGoals, this.state.gotTasks)
    // console.log(this.state.meetings)
    return(
      <div className="bg-black text-gray-50 min-h-screen">
        <Router>
          {/* NAV elements adapted from  https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/navbars*/}
          <nav className="fixed w-screen flex flex-wrap items-center justify-between py-3 bg-black mb-3">
            <div className="container px-4 mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                
                {/* <Link to='/home' ><p className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"> (LOGO) </p></Link> */}
                <img className="max-h-12" src={logo} alt=""/>  
              </div>

              <div className= "lg:flex flex-grow items-center">
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-4">
                  <li className="nav-item">
                    <Link to='/student-meeting' >
                      <p 
                        className={`px-3 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white rounded hover:opacity-75 ${this.state.childComp==="gm"?"underline":null}`}
                        onClick={() => this.setState({childComp: "gm"})}
                      >
                        Goals and Meetings
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
                    onClick={() => this.setState({childComp: ""})}
                    style={{filter: "invert(43%) sepia(9%) saturate(543%) hue-rotate(182deg) brightness(101%) contrast(97%)"}} 
                    src={cog} 
                    alt="cog"
                  />
                </Link>
              </div>

            </div>
          </nav>

          {/* NAV END ATTRIBUTION */}
          <Switch>
            <Route exact path='/student-meeting'>
              <StudentMeetingView 
                user={this.props.currUser} 
                meetings={this.state.meetings}
                goals={this.state.goals}
                tasks={this.state.tasks}
                getMeetings={this.getMeetings}
                getGoals={this.getGoals}
                getTasks={this.getTasks}
                setStudState={this.setState}
              />
            </Route>
            <Route exact path='/settings'><UpdateSettings user={this.props.currUser} setAppState={this.props.setAppState}/></Route>
          </Switch>
          {this.state.gotMeetings && this.state.gotGoals && this.state.gotTasks
          ? <Redirect to="/student-meeting"/> 
          : null}
        </Router>
      </div>
    )
  }
}

export default Student;