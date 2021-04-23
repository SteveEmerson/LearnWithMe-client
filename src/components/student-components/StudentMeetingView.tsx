import * as React from 'react';
import GoalCard from '../goal-components/GoalCard';
import MeetingCardSmall from '../meeting-components/MeetingCardSmall';
import MakeGoal from '../goal-components/MakeGoal';
import ScheduleMeeting from '../meeting-components/ScheduleMeeting';

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
  availability: {}
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
  id: number,
  email: string,
  passwordhash: string,
  name: string,
  studentList: number[]
  role: string,
  availability: {},
  createdAt: string,
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
        availability: this.props.user.availability
      }
    }

    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getTeacherList()
  }

  toggleScheduleMeeting = () => {
    this.setState({scheduleMeeting: !this.state.scheduleMeeting})
  }

  toggleMakeGoal = () => {
    this.setState({makeGoal: !this.state.makeGoal})
  }

  getTeacherList = () => {
    const url: string = `http://localhost:3000/teacher/`
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
          return {id: partner.id, displayName: partner.name, email:partner.email, availability:partner.availability}
        } )
        this.setState({allStudentTeachers: allTeachers})
        console.log(this.state.allStudentTeachers)
      })
      .catch(err => {
        console.log(`Error in fetching teachers: ${err}`)
      }) 
  }

  renderGoalList = () => {
    return (
      this.props.goals.map((goal) => {
        return (
          <GoalCard
              rolePOV= {this.props.user.role}
              student= {
                {
                  id: this.props.user.userId,
                  displayName: this.props.user.displayName,
                  email: this.props.user.email,
                  availability: this.props.user.availability
                }
              }
              goal={goal} 
              token={this.props.user.sessionToken}
              tasks={this.props.tasks.filter((task) => task.goalId === goal.id)}
              setGParState={this.props.setStudState}
              getStudentGoals={this.props.getGoals}
              key={`GC${goal.id}`}
          />
        )
      })
    )
  }

  renderMeetingList = () => {
    return (
      this.props.meetings.map((meeting) => {
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
      <div>
        <h3>Student Meeting View</h3>
        <hr/>
        <button onClick={this.toggleMakeGoal}>Make Goal</button>
        {this.state.makeGoal 
          ? <MakeGoal 
              student={this.state.student}
              setGParState={this.props.setStudState}
              sessionToken={this.props.user.sessionToken}
              setParState={this.setState}
              getStudentGoals={this.props.getGoals}
              getStudentTasks={this.props.getTasks}
              toggleMakeGoal={this.toggleMakeGoal}
            /> 
          : null}

        <button onClick={this.toggleScheduleMeeting}>Schedule Meeting</button>
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
        <div className="GoalCardList">
          {this.props.goals.length !== 0 ? this.renderGoalList() : null}
        </div>
        <div className="MeetingCardSmallList">
          {this.props.meetings.length !== 0 ? this.renderMeetingList() : null}
        </div>
      </div>
    )
  }
}

export default StudentMeetingView