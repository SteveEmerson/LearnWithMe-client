import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?:Array<Meeting>
  goal?: Goal
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

type SCSState = {
  
}

class StudentCardSmall extends React.Component<SCSProps,SCSState>{
  constructor(props: SCSProps){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
    
  }



  getGoal = () => {

  }

  setCurrStudent = () => {
    this.props.setTSVState({currStudent: this.props.student})
  }

  render(){
    return(
      <div>
        <h4>Student Card Small</h4>
        <div onClick={()=> this.setCurrStudent()}>
          <p >{this.props.student.displayName}</p>
          <p>M {this.props.student.meetings ? this.props.student.meetings.length : null}</p>
          <p>{this.props.student.goal ? 'G' : null}</p>
        </div>
      </div>
    ) 
  }
}

export default StudentCardSmall