import * as React from 'react';

//Some of this will need changed when  this component is reused in other places.
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

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10) + "T07:00"
  }

  getMaxDate = (): Date => {
    let today: Date = new Date();
    let cYear: number = today.getFullYear()
    let cMonth: number = today.getMonth();
    let maxMonth: number = 5;
    let maxYear: number = cYear;
    if (cMonth > maxMonth){
      maxYear = cYear + 1
    }
    let maxDay: number = this.getLastDayOfMonth(maxMonth, maxYear);
    return new Date(maxYear, maxMonth, maxDay)
  }

  getLastDayOfMonth = (m: number, y: number): number => {
    let date: Date = new Date(y, m + 1, 0);
    let day: number = date.getDate();
    return day
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
        // Some of this maybe going to need to change later ... this component will be used elsewhere as well
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
    console.log(this.getDateString(new Date()))
    console.log(this.getDateString(this.getMaxDate()))
    return(
      <div>
        <h4>Schedule Meeting</h4>
        <p>Schedule a new meeting with {this.props.student.displayName}</p>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
          <label htmlFor="meeting-time">Meeting Time:</label>
          <input onChange={this.handleDate} type="datetime-local" id="meeting-time"
            name="meeting-time" value={this.getDateString(new Date())}
            min={this.getDateString(new Date())} max={this.getDateString(this.getMaxDate())}>
          </input>
          <input type='submit' value='Submit'/>
        </form>

      </div>
    )
  }
}

export default ScheduleMeeting