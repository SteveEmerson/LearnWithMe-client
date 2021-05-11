import * as React from 'react';
import GoalCard from '../goal-components/GoalCard';
import MakeGoal from '../goal-components/MakeGoal';
import MeetingCardMini from '../meeting-components/MeetingCardMini';
import ScheduleMeeting from '../meeting-components/ScheduleMeeting';

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
  getMeetings: Function
  getGoals: Function
  getTasks: Function
  meetings: Array<Meeting>
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
        availability: {...this.props.teacher.availability},
        partners: this.props.teacher.partnerList,
        meetings: this.props.meetings
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
              getMeetings={this.props.getMeetings}
            />
        )
      })
    )
  }

  render(){
    let num_meetings = this.props.student.meetings ? this.props.student.meetings.length : 0;
    return(
      <div className="bg-white text-black p-3">
        <div className="flex flex-row justify-between border-b-2 border-blue-500" style={{borderColor:"blue"}}>
          <p className="font-bold text-3xl mb-4">{this.props.student.displayName}</p>
          <div className="flex flex-row space-x-1">
            <button
              className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"
              id="schedule-meeting" 
              onClick={this.toggleScheduleMeeting}>
                meet
            </button>
            {!this.props.student.goal 
            ? <button
                className="max-h-5 px-2 py-2 flex items-center text-xs uppercase font-bold text-white bg-gray-500 rounded hover:opacity-75"
                id="make-goal" 
                onClick={this.toggleMakeGoal}>
                  goal
              </button> 
            : null}
          </div>
          
        </div>
        
        {this.state.scheduleMeeting 
          ? <ScheduleMeeting 
              teacher={this.state.teacher} 
              student={this.props.student}
              setGParState={this.props.setTSVState}
              getTeacherMeetings={this.props.getMeetings}
              token={this.props.token}
              allTeachers={null}
              allStudents={null}
              toggleScheduleMeeting={this.toggleScheduleMeeting}
              mountingFrom={"SCF"}
            /> 
          : null}

          <div>
          {this.state.makeGoal 
          ? <MakeGoal
              teacherId={this.props.teacher.userId}
              teacherName = {this.props.teacher.displayName} 
              student={this.props.student}
              setGParState={this.props.setTSVState}
              sessionToken={this.props.teacher.sessionToken}
              setParState={this.setState} //NEED THIS ??
              toggleMakeGoal={this.toggleMakeGoal}
              getGoals={this.props.getGoals}
              getTasks={this.props.getTasks}
            /> 
          : null}
          </div>
       
        <p className="font-bold text-2xl mt-2">Goal</p>
        {this.props.student.goal 
          ? <GoalCard
              rolePOV= {'teacher'}
              student={this.props.student}
              goal={this.props.student.goal} 
              token={this.props.token}
              tasks={this.props.student.tasks}
              setGParState={this.props.setTSVState}
              getGoals={this.props.getGoals}
              getTasks={this.props.getTasks}
            />
          : null}

        <p className="font-bold text-2xl  mt-3"> Meetings</p>
        <div className={`bg-white text-black 
                      ${num_meetings > 0 ? "border" : null} 
                        p-2 mt-1`}>
          <div className="">
            {this.props.student.meetings ? this.renderMeetingMinis() : null}
          </div>
          
        </div>

      </div>
    )
  }
}

export default StudentCardFull