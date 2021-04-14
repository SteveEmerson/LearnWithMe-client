import * as React from 'react';

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
}

type TMVProps = {
  user: User
}

class TeacherMeetingView extends React.Component<TMVProps,{}>{
  render(){
    return(
      <div>
        <h4>TeacherMeetingView</h4>
      </div>
    )
  }
}

export default TeacherMeetingView