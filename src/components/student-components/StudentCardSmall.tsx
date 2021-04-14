import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?:number[]
  goals?:number[]
}

type SCSProps = {
  student: Student
  setTSVState: Function
}

type SCSState = {
  meetings: number[]
  goals: number[]
}

class StudentCardSmall extends React.Component<SCSProps,SCSState>{
  constructor(props: SCSProps){
    super(props);
    this.state = {
      meetings: [],
      goals: []
    }
  }

  setCurrStudent = () => {
    let thisStudent: Student = {
      id: this.props.student.id,
      displayName: this.props.student.displayName,
      meetings: this.state.meetings,
      goals: this.state.goals
    }

    this.props.setTSVState({currStudent: thisStudent})
  }
  render(){
    return(
      <div>
        <h4>Student Card Small</h4>
        <p onClick={()=> this.setCurrStudent()}>{this.props.student.displayName}</p>
      </div>
    )
  }
}

export default StudentCardSmall