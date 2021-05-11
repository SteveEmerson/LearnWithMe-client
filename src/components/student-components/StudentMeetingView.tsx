import * as React from 'react';
import GoalCard from '../goal-components/GoalCard';
import MeetingCardSmall from '../meeting-components/MeetingCardSmall';
import MakeGoal from '../goal-components/MakeGoal';
import ScheduleMeeting from '../meeting-components/ScheduleMeeting';
import APIURL from '../../helpers/environment'

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

type Student = {
  id: number
  displayName: string
  email: string
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
  partners: number[]
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
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

type Teacher = {
  id: number
  displayName: string
  email: string
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
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

type FetchTeacherData = {
  id: number
  email: string
  passwordhash: string
  name: string
  studentList: number[]
  role: string
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
  createdAt: string
  updatedAt: string
}

type SMVProps = {
  user: User
  meetings: Array<Meeting>
  goals: Array<Goal>
  tasks: Array<Task>
  getMeetings: Function
  getGoals: Function
  getTasks: Function
  setStudState: Function
}

type SMVState = {
  allStudentTeachers: Array<Teacher>
  makeGoal: boolean
  scheduleMeeting: boolean
  student: Student
  sortedMeetings: Array<Meeting>
  sortedGoals: Array<Goal>
}


type AllPartners = Array<FetchTeacherData>

class StudentMeetingView extends React.Component<SMVProps, SMVState>{
  constructor(props: SMVProps){
    super(props);
    this.state = {
      allStudentTeachers: [],
      makeGoal: false,
      scheduleMeeting: false,
      student: {
        id: this.props.user.userId,
        displayName: this.props.user.displayName,
        email: this.props.user.email,
        availability: this.props.user.availability,
        partners: this.props.user.partnerList,
        meetings: this.props.meetings
      },
      sortedMeetings: [],
      sortedGoals: []
    }

    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getTeacherList();
    this.sortMeetings();
    this.sortGoals();
  }

  componentDidUpdate(prevProps: SMVProps, prevState: SMVState) {

    if(prevProps.meetings.length !== this.props.meetings.length){
      
      this.sortMeetings()
      this.buildStudent()
    }

    if(prevProps.goals.length !== this.props.goals.length){
      
      this.sortGoals()
    }
  }

  buildStudent = () => {
    let stdnt: Student = {
      id: this.props.user.userId,
      displayName: this.props.user.displayName,
      email: this.props.user.email,
      availability: this.props.user.availability,
      partners: this.props.user.partnerList,
      meetings: this.props.meetings
    }
    this.setState({student: stdnt})
  }

  compareMeetingLists = (ml1: Array<Meeting>, ml2: Array<Meeting>): boolean => {
    let same: boolean = true;
    for(let i: number = 0; i < ml1.length; i++){
      if(ml1[i].id !== ml2[i].id){
        same = false
      }
    }

    return same
  }

  sortMeetings = () => {
    //let today = new Date()
    let temp: Array<Meeting> = this.props.meetings.filter((meeting) => {
      return meeting
    })
    temp.sort((m1, m2) => (m1.d_t > m2.d_t) ? -1 : 1)

    this.setState({sortedMeetings: temp})
  }

  sortGoals = () => {
    let temp: Array<Goal> = this.props.goals.filter((goal) => {
      return goal
    })
    temp.sort((g1, g2) => (g1.targetDate > g2.targetDate) ? 1 : -1)

    this.setState({sortedGoals: temp})
  }

  toggleScheduleMeeting = () => {
    this.setState({scheduleMeeting: !this.state.scheduleMeeting})
  }

  toggleMakeGoal = () => {
    this.setState({makeGoal: !this.state.makeGoal})
  }

  getTeacherList = () => {
    const url: string = `${APIURL}/teacher/`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.user.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: AllPartners) => {
        let allTeachers: Array<Teacher> = 
        data.filter((partner: FetchTeacherData) => {
          return this.props.user.partnerList.includes(partner.id)
        })
        .map((partner: FetchTeacherData) => {
          return {
            id: partner.id, 
            displayName: partner.name, 
            email:partner.email, 
            availability:partner.availability,
            partners: partner.studentList
          }
        } )
        this.setState({allStudentTeachers: allTeachers})
      })
      .catch(err => {
        console.log(`Error in fetching teachers: ${err}`)
      }) 
  }

  renderGoalList = () => {
    return (
      this.state.sortedGoals.map((goal) => {
        return (
          <GoalCard
              rolePOV= {this.props.user.role}
              student= {
                {
                  id: this.props.user.userId,
                  displayName: this.props.user.displayName,
                  email: this.props.user.email,
                  availability: this.props.user.availability,
                  partners: this.props.user.partnerList
                }
              }
              goal={goal} 
              token={this.props.user.sessionToken}
              tasks={this.props.tasks.filter((task) => task.goalId === goal.id)}
              setGParState={this.props.setStudState}
              getGoals={this.props.getGoals}
              getTasks={this.props.getTasks}
              key={`GC${goal.id}`}
          />
        )
      })
    )
  }

  renderMeetingList = () => {
    return (
      this.state.sortedMeetings.map((meeting) => {
        let teacher = this.state.allStudentTeachers.find(teacher => teacher.id === meeting.teacherId)
        let teacherName = teacher ? teacher.displayName : "no teacher"
        return (
          <MeetingCardSmall 
            meeting= {meeting}
            token= {this.props.user.sessionToken}
            studentName= {this.props.user.displayName}
            teacherName= {teacherName}
            getMeetings={this.props.getMeetings}
            role={"student"}
            key={`MCS${meeting.id}`}
          />
        )
      })
    )
  }

  render(){
    return(
      <div className="px-10 pt-20">
        <p className="font-bold text-5xl text-blue-500 mb-3" style={{color:"blue"}}>
          {this.props.user.displayName}
        </p>
        <div className="grid grid-cols-2 gap-6 justify-items-end"> 
          <button
            className=" px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75 max-h-10 self-center"
            id="schedule-meeting" 
            onClick={this.toggleMakeGoal}
            style={{backgroundColor:"blue"}}
          >
            new goal
          </button>
          <button
            className=" px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75 max-h-10 self-center mr-6"
            id="schedule-meeting" 
            onClick={this.toggleScheduleMeeting}
            style={{backgroundColor:"blue"}}
          >
            new meeting
          </button>
         </div>
        
        {this.state.makeGoal 
          ? <MakeGoal 
              student={this.state.student}
              setGParState={this.props.setStudState}
              sessionToken={this.props.user.sessionToken}
              setParState={this.setState}
              getGoals={this.props.getGoals}
              getTasks={this.props.getTasks}
              toggleMakeGoal={this.toggleMakeGoal}
            /> 
          : null}

        
        {this.state.scheduleMeeting
          ? <ScheduleMeeting
              teacher={null}
              student={this.state.student}
              setGParState={this.props.setStudState}
              token={this.props.user.sessionToken}
              allTeachers={this.state.allStudentTeachers}
              allStudents={null}
              getStudentMeetings={this.props.getMeetings}
              toggleScheduleMeeting={this.toggleScheduleMeeting}
              mountingFrom={"SMV"}
            /> 
          : null}
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-6 mt-6 h-40">
            {this.props.goals.length !== 0 ? this.renderGoalList() : null}
          </div>
          <div className="MeetingCardSmallList">
            {this.props.meetings.length !== 0 ? this.renderMeetingList() : null}
          </div>
        </div>
      </div>
    )
  }
}

export default StudentMeetingView