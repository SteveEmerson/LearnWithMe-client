import * as React from 'react';
import MeetingCardSmall from '../meeting-components/MeetingCardSmall';
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
  partners: number[]
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
}

type Teacher = {
  id: number
  displayName: string
  email: string
  availability: {}
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

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
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

type TMVProps = {
  user: User
  meetings: Array<Meeting>
  getMeetings: Function
  setTeacherState: Function
}

type TMVState = {
  allTeacherStudents: Array<Student>
  scheduleMeeting: boolean
  teacher: Teacher
}

class TeacherMeetingView extends React.Component<TMVProps,TMVState>{
  constructor(props: TMVProps){
    super(props);
    this.state = {
      allTeacherStudents: [],
      scheduleMeeting: false,
      teacher: {
        id: this.props.user.userId,
        displayName: this.props.user.displayName,
        email: this.props.user.email,
        availability: this.props.user.availability,
        partners: this.props.user.partnerList
      }

    }
  }

  componentDidMount(){
    this.getStudentList()
  }

  toggleScheduleMeeting = () => {
    this.setState({scheduleMeeting: !this.state.scheduleMeeting})
  }

  getStudentList = () => {
    const url: string = `http://localhost:3000/student/`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.user.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Array<FetchStudentData>) => {
        let allStudents: Array<Student> = 
        data.filter((partner: FetchStudentData) => {
          return this.props.user.partnerList.includes(partner.id)
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
        this.setState({allTeacherStudents: allStudents})
        console.log(this.state.allTeacherStudents)
      })
      .catch(err => {
        console.log(`Error in fetching students: ${err}`)
      }) 
  }


  renderMeetingList = () => {
    return (
      this.props.meetings.map((meeting) => {
        let student = this.state.allTeacherStudents.find(student => student.id === meeting.studentId)
        let studentName = student ? student.displayName : "no student"
        return (
          <MeetingCardSmall 
            meeting= {meeting}
            token= {this.props.user.sessionToken}
            teacherName= {this.props.user.displayName}
            studentName= {studentName}
            getMeetings={this.props.getMeetings}
            key={`MCS${meeting.id}`}
            role={'teacher'}
          />
        )
      })
    )
  }

  render(){
    return(
      <div >
        <p className="font-bold text-3xl text-blue-500 mb-3">{this.props.user.displayName}</p>
        <hr/>
        <button onClick={this.toggleScheduleMeeting}>Schedule Meeting</button>
        {this.state.scheduleMeeting
          ? <ScheduleMeeting
              teacher={this.state.teacher}
              student={null}
              setGParState={this.props.setTeacherState}
              token={this.props.user.sessionToken}
              allStudents={this.state.allTeacherStudents}
              allTeachers={null}
              getTeacherMeetings={this.props.getMeetings}
              toggleScheduleMeeting={this.toggleScheduleMeeting}
              mountingFrom= {"TMV"}
            /> 
          : null}
        <div className="MeetingCardSmallList">
          {this.props.meetings.length !== 0 ? this.renderMeetingList() : null}
        </div>
      </div>
    )
  }
}

export default TeacherMeetingView