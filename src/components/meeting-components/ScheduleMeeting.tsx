import * as React from 'react';

//Some of this will need changed when  this component is reused in other places.
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

// type User = {
//   email: string
//   userId: number
//   displayName: string
//   partnerList: number[]
//   role: string
//   availability: {}
//   sessionToken: string
// }

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
  teacher: Teacher | null
  student: Student | null
  setGParState: Function
  token: string
  allTeachers: Array<Teacher> | null
  allStudents: Array<Student> | null
  getStudentMeetings?: Function
  getTeacherMeetings?: Function
  toggleScheduleMeeting:Function
  mountingFrom: string
}

type SMState = {
  d_t: Date
  teacher: Teacher
  student: Student
}

class ScheduleMeeting extends React.Component<SMProps,SMState>{
  constructor(props: SMProps){
    super(props);
    this.state = {
      d_t: new Date(),
      teacher: {
        id: 0,
        displayName: "",
        email: "",
        availability: {}
      },
      student: {
        id: 0,
        displayName: "",
        email: "",
        availability: {}
      }
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
    let role = this.props.teacher ? 'teacher' : 'student'
    e.preventDefault();
    const url: string = `http://localhost:3000/meeting/${role}_create`
    fetch(url,
      {
          method: 'POST',
          body: JSON.stringify(
            {
              d_t: this.state.d_t, 
              teacherId: this.props.teacher ? this.props.teacher.id: this.state.teacher.id,
              studentId: this.props.student ? this.props.student.id: this.state.student.id
            }
          ),
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.token
          })
      })
      .then((res) => res.json())
      .then((data: Meeting) => {
        // let meetings:  Array<Meeting> | undefined = 
        // this.props.student ? this.props.student.meetings : [];
        
        // if(this.props.student && role === "teacher" && this.props.mountingFrom === "SCF") {
        //   let cStud: Student = {
        //     id: this.props.student.id,
        //     displayName: this.props.student.displayName,
        //     email: this.props.student.email,
        //     availability: this.props.student.availability,
        //     meetings: meetings ? [...meetings, data] : [data],
        //     goal:this.props.student.goal
        //   }
        
        //   this.props.setGParState({currStudent: cStud})
        // }

        if(role === "teacher" && this.props.getTeacherMeetings){
          this.props.getTeacherMeetings()
        }

        if(role === "student" && this.props.getStudentMeetings){
          this.props.getStudentMeetings()
        }

        this.props.toggleScheduleMeeting()
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  componentDidUpdate(){
    console.log(this.state.d_t)
  }

  renderTeacherSelect = () => {
    return(
      <select 
        name="teachers" 
        id='teacher-select'
        onChange={(e) => this.handleTeacherSelect(e.currentTarget.value)}
      >
        <option defaultValue="Select">Select a teacher</option>
        {this.props.allTeachers?.map((teacher: Teacher) => {
          return(
            <option value={teacher.id} key={`TOP${teacher.id}`}>{teacher.displayName}</option>
          )
        })}
      </select>
    )
  }

  renderStudentSelect = () => {
    return(
      <select 
        name="students" 
        id='student-select'
        onChange={(e) => this.handleStudentSelect(e.currentTarget.value)}
      >
        <option defaultValue="Select">Select a student</option>
        {this.props.allStudents?.map((student: Student) => {
          return(
            <option value={student.id}>{student.displayName}</option>
          )
        })}
      </select>
    )
  }

  handleTeacherSelect = (idString: string) => {
    let id: number = Number(idString)
    console.log(id)
    let selectedTeacher: Teacher | undefined = this.props.allTeachers?.find(teacher => teacher.id === id)
    if (selectedTeacher) this.setState({teacher: selectedTeacher});
    console.log(selectedTeacher)
  }

  handleStudentSelect = (idString: string) => {
    let id: number = Number(idString)
    console.log(id)
    let selectedStudent: Student | undefined = this.props.allStudents?.find(student => student.id === id)
    if (selectedStudent) this.setState({student: selectedStudent});
    console.log(selectedStudent)
  }

  render(){
    console.log(this.getDateString(new Date()))
    console.log(this.getDateString(this.getMaxDate()))
    return(
      <div>
        <h4>Schedule Meeting</h4>
        {this.props.teacher && this.props.student
          ? <p>Schedule a new meeting with {this.props.student.displayName}</p>
          : this.props.student ? this.renderTeacherSelect() : this.renderStudentSelect()
        }
        
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