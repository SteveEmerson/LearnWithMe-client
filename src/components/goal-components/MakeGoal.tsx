import * as React from 'react';

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

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
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

type MGProps = {
  // teacher: User
  // student: Student
  // setTSVState: Function
}

class MakeGoal extends React.Component<MGProps,{}>{
  render(){
    return(
      <div>
        <h4>MakeGoal</h4>
      </div>
    )
  }
}

export default MakeGoal