import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?:Array<Meeting>
  goal?: Goal
}

type Goal = {
  description : string,
  dateCreated: Date,
  targetDate: Date
}

type SCSProps = {
  student: Student
  setTSVState: Function
  token: string
}

type Meeting= {
  id: number,
  dt: string,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
}

type SCSState = {
  meetings: Array<Meeting>
  goal: Goal
}

class StudentCardSmall extends React.Component<SCSProps,SCSState>{
  constructor(props: SCSProps){
    super(props);
    this.state = {
      meetings: [],
      goal: {
        description : "",
        dateCreated: new Date(),
        targetDate: new Date()
      }
    }
  }

  componentDidMount(){
    
  }



  getGoal = () => {

  }

  setCurrStudent = () => {
    let thisStudent: Student = {
      id: this.props.student.id,
      displayName: this.props.student.displayName,
      meetings: this.state.meetings,
      goal: this.state.goal
    }

    this.props.setTSVState({currStudent: thisStudent})
  }

  render(){
    return(
      <div>
        <h4>Student Card Small</h4>
        <div onClick={()=> this.setCurrStudent()}>
          <p >{this.props.student.displayName}</p>
          <p>M {this.state.meetings.length}</p>
        </div>
      </div>
    ) 
  }
}

export default StudentCardSmall