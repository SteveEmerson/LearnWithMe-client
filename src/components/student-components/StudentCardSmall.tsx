import * as React from 'react';

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  meetings?:Array<Meeting>
  goal?:Goal
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

class StudentCardSmall extends React.Component<SCSProps,{}>{

  setCurrStudent = () => {
    this.props.setTSVState({currStudent: this.props.student})
  }

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