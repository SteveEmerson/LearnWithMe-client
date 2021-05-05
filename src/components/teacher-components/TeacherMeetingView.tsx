import * as React from 'react';
import MeetingCardSmall from '../meeting-components/MeetingCardSmall';
import ScheduleMeeting from '../meeting-components/ScheduleMeeting';
import APIURL from '../../helpers/environment'

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
  pastMeetings: Array<Meeting>
  futureMeetings: Array<Meeting>
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
      },
      pastMeetings: [],
      futureMeetings: []
    }
  }

  componentDidMount(){
    this.getStudentList()
    this.sortMeetings()
  }

  componentDidUpdate(prevProps: TMVProps, prevState: TMVState){
    if(prevProps.meetings.length !== this.props.meetings.length){
      this.sortMeetings()
    }
  }

  sortMeetings = () => {
    let today = new Date()
    let tempPast: Array<Meeting> = this.props.meetings.filter((meeting) => {
      let mtg_d = new Date(meeting.d_t);
      return mtg_d < today
    })
    tempPast.sort((m1, m2) => (m1.d_t > m2.d_t) ? -1 : 1)

    let tempFuture: Array<Meeting> = this.props.meetings.filter((meeting) => {
      let mtg_d = new Date(meeting.d_t);
      return mtg_d >= today
    })
    tempFuture.sort((m1, m2) => (m1.d_t > m2.d_t) ? -1 : 1)

    this.setState({pastMeetings: tempPast})
    this.setState({futureMeetings: tempFuture})
  }

  toggleScheduleMeeting = () => {
    this.setState({scheduleMeeting: !this.state.scheduleMeeting})
  }

  getStudentList = () => {
    const url: string = `http://${APIURL}/student/`
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
      })
      .catch(err => {
        console.log(`Error in fetching students: ${err}`)
      }) 
  }


  renderMeetingList = (mtgs: Array<Meeting>) => {
    return (
      mtgs.map((meeting) => {
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
      <div className="px-10 pt-20">
        <div className="flex flex-row justify-between">
          <p className="font-bold text-5xl text-blue-500 mb-5 ml-4" style={{color:"blue"}}>
            {this.props.user.displayName}
          </p>
          <button
            className=" px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-blue-600 rounded hover:opacity-75 max-h-10 self-center ml-10"
            style={{backgroundColor:"blue"}}
            id="schedule-meeting" 
            onClick={this.toggleScheduleMeeting}
          >
            new meeting
          </button>
        </div>
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            {this.state.pastMeetings.length !== 0 ? this.renderMeetingList(this.state.pastMeetings) : null}
          </div>
          <div>
            {this.state.futureMeetings.length !== 0 ? this.renderMeetingList(this.state.futureMeetings) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default TeacherMeetingView