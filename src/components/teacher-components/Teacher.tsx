import * as React from 'react';

type TeacherProps = {
  currUser: User
  setAppState: Function
}

type User = {
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability?: {temp?:any}
}
class Teacher extends React.Component<TeacherProps, {}> {

  handleLogout = () :void => {
    localStorage.removeItem('sessionToken')
    this.props.setAppState(
      {
        role: "",
        displayName: "",
        userId: 0,
        partnerList: [],
        availability: {temp:{}}
      }
    )
  }

  render() {
    return(
      <div>
        <h4><button onClick={this.handleLogout}>Logout</button></h4>
        Got to teacher
      </div>
    )
  }
}

export default Teacher;