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

type SMVProps = {
  user: User
}

class StudentMeetingView extends React.Component<SMVProps, {}>{

  render(){
    return(
      <div>
        <h3>Student Meeting View</h3>
        <hr/>
      </div>
    )
  }
}

export default StudentMeetingView