import * as React from 'react';
import GoalCard from '../goal-components/GoalCard';
import MakeGoal from '../goal-components/MakeGoal';
import MeetingCardMini from '../meeting-components/MeetingCardMini';
import ScheduleMeeting from '../meeting-components/ScheduleMeeting';

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
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


type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
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

type SCFProps = {
  student: Student
  setTSVState: Function
  token: string
  teacher: User
}

type SCFState = {
  // newGoal: Goal
  // newMeeting: Meeting
  scheduleMeeting: boolean
  makeGoal: boolean
  teacher: Teacher
}

/*********************************************************/

class StudentCardFull extends React.Component<SCFProps,SCFState>{
  constructor(props: SCFProps){
    super(props);
    this.state = {
      scheduleMeeting: false,
      makeGoal: false,
      teacher: {
        id: this.props.teacher.userId,
        displayName: this.props.teacher.displayName,
        email: this.props.teacher.email,
        availability: {...this.props.teacher.availability}
      }
    }
    this.setState = this.setState.bind(this)
  }

  toggleScheduleMeeting = () => {
    this.setState({scheduleMeeting: !this.state.scheduleMeeting})
  }

  toggleMakeGoal = () => {
    this.setState({makeGoal: !this.state.makeGoal})
  }

  renderMeetingMinis = () => {
    return(
      this.props.student.meetings?.map((meeting) => {
        return(
          <MeetingCardMini 
            meeting={meeting} 
            token={this.props.token} 
            teacherName={this.props.teacher.displayName}
            studentName={this.props.student.displayName}
            key={`MCM${meeting.id}`}
          />
        )
      })
    )
  }

  render(){
    return(
      <div style={{border:'2px solid'}}>
        <h4>Student Card Full</h4>
        <p>{this.props.student.displayName}</p>
        <button id="schedule-meeting" onClick={this.toggleScheduleMeeting}>New Meeting</button>
        {!this.props.student.goal ? <button id="make-goal" onClick={this.toggleMakeGoal}>New Goal</button> : null}
        {this.state.scheduleMeeting 
          ? <ScheduleMeeting 
              teacher={this.state.teacher} 
              student={this.props.student}
              setGParState={this.props.setTSVState}
              token={this.props.token}
              allTeachers={null}
              toggleScheduleMeeting={this.toggleScheduleMeeting}
            /> 
          : null}
        {this.state.makeGoal 
          ? <MakeGoal 
              teacherId={this.props.teacher.userId}
              teacherName = {this.props.teacher.displayName} 
              student={this.props.student}
              setGParState={this.props.setTSVState}
              sessionToken={this.props.teacher.sessionToken}
              setParState={this.setState} //NEED THIS ??
              toggleMakeGoal={this.toggleMakeGoal}
            /> 
          : null}
        {this.props.student.goal 
          ? <GoalCard
              rolePOV= {'teacher'}
              student={this.props.student}
              goal={this.props.student.goal} 
              token={this.props.token}
              tasks={this.props.student.tasks}
              setGParState={this.props.setTSVState}
            />
          : null}
        {this.props.student.meetings ? this.renderMeetingMinis() : null}

      </div>
    )
  }
}

export default StudentCardFull