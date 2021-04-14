import * as React from 'react';

type Student = {
  id: number
  displayName: string
  meetings?: Array<Meeting>
  goals?: Goal
}

type Goal = {
  description : string,
  dateCreated: Date,
  targetDate: Date
}

type Meeting= {
  id: number,
  d_t: Date,
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