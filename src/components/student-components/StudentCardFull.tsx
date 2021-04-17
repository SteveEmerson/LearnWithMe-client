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

type SCFProps = {
  student: Student
  setTSVState: Function
  token: string
  teacher: User
}

type SCFState = {
  // newGoal: Goal
  // newMeeting: Meeting
  makeMeeting: boolean
  makeGoal: boolean
}

/*********************************************************/

class StudentCardFull extends React.Component<SCFProps,SCFState>{
  constructor(props: SCFProps){
    super(props);
    this.state = {
      makeMeeting: false,
      makeGoal: false
    }
    this.setState = this.setState.bind(this)
  }

  toggleMakeMeeting = () => {
    this.setState({makeMeeting: !this.state.makeMeeting})
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
        <button id="schedule-meeting" onClick={this.toggleMakeMeeting}>New Meeting</button>
        {!this.props.student.goal ? <button id="make-goal" onClick={this.toggleMakeGoal}>New Goal</button> : null}
        {this.state.makeMeeting 
          ? <ScheduleMeeting 
              teacher={this.props.teacher} 
              student={this.props.student}
              setTSVState={this.props.setTSVState}
            /> 
          : null}
        {this.state.makeGoal 
          ? <MakeGoal 
              teacherId={this.props.teacher.userId}
              teacherName = {this.props.teacher.displayName} 
              student={this.props.student}
              setTSVState={this.props.setTSVState}
              sessionToken={this.props.teacher.sessionToken}
              setSCFState={this.setState}
            /> 
          : null}
        {this.props.student.goal 
          ? <GoalCard 
              goal={this.props.student.goal} 
              token={this.props.token}
            />
          : null}
        {this.props.student.meetings ? this.renderMeetingMinis() : null}

      </div>
    )
  }
}

export default StudentCardFull