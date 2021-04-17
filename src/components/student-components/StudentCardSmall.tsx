import * as React from 'react';

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

type SCSProps = {
  student: Student
  setTSVState: Function
  token: string
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

class StudentCardSmall extends React.Component<SCSProps,{}>{

  setCurrStudent = () => {
    this.props.setTSVState({currStudent: this.props.student})
  }

  // ADD DISPLAYING TASK INFO NEXT TO GOAL IE "T 2 3"
  render(){
    return(
      <div style={{border:'1px solid'}} onClick={()=> this.setCurrStudent()}>
        <h4>Student Card Small</h4>
        <div >
          <p >{this.props.student.displayName}</p>
          <p>M {this.props.student.meetings ? this.props.student.meetings.length : null}</p>
          <p>{this.props.student.goal ? 'G' : null}</p>
        </div>
      </div>
    ) 
  }
}

export default StudentCardSmall