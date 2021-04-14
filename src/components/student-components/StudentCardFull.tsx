import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?: Array<Meeting>
  goals?: number[]
}

type Meeting= {
  id: number,
  dt: string,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
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