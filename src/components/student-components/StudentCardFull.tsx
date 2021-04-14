import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?: number[]
  goals?: number[]
}

type SCFProps = {
  student: Student
}

class StudentCardFull extends React.Component<SCFProps,{}>{
  render(){
    return(
      <div>
        <h4>Student Card Full</h4>
        <p>{this.props.student.displayName}</p>
      </div>
    )
  }
}

export default StudentCardFull