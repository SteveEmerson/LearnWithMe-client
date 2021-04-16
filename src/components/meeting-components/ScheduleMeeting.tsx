import * as React from 'react';

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
  id: number
  d_t: Date
  teacherId: number
  studentId: number
  createdAt: Date
  updatedAt: Date
}

type SMProps = {
  teacher: User
  student: Student
  setTSVState: Function
}

type SMState = {
  d_t: Date
}
class ScheduleMeeting extends React.Component<SMProps,SMState>{
  constructor(props: SMProps){
    super(props);
    this.state = {
      d_t: new Date()
    }
  }

  handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({d_t: new Date(e.currentTarget.value)})
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url: string = `http://localhost:3000/meeting/teacher_create`
    fetch(url,
      {
          method: 'POST',
          body: JSON.stringify(
            {
              d_t: this.state.d_t, 
              teacherId: this.props.teacher.userId,
              studentId: this.props.student.id
            }
          ),
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.teacher.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: Meeting) => {
        let meetings:  Array<Meeting> = 
        this.props.student.meetings ? this.props.student.meetings : [];
        
        let cStud: Student = {
          id: this.props.student.id,
          displayName: this.props.student.displayName,
          email: this.props.student.email,
          availability: this.props.student.availability,
          meetings: [...meetings, data],
          goal:this.props.student.goal
        }
      
        this.props.setTSVState({currStudent: cStud})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  componentDidUpdate(){
    console.log(this.state.d_t)
  }

  render(){
    return(
      <div>
        <h4>Schedule Meeting</h4>
        <p>Schedule a new meeting with {this.props.student.displayName}</p>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
          <label htmlFor="meeting-time">Meeting Time:</label>
          <input onChange={this.handleDate} type="datetime-local" id="meeting-time"
            name="meeting-time" value={String(new Date(Date.now()))}
            min={String(new Date(Date.now()))} max="2021-06-01T00:00">
          </input>
          <input type='submit' value='Submit'/>
        </form>

      </div>
    )
  }
}

export default ScheduleMeeting