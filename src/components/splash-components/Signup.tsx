import * as React from 'react';

type SignupProps = {
  setAppState: Function
}

type User = {
  role: string
  displayName: string
  userId: number
}

type SignupState = {
  sessionToken: string
  user: User
}

class Signup extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps){
    super(props);
    this.state = {
      sessionToken: "",
      user: {
        role: "",
        displayName: "",
        userId: 0
      }
    }
  }

  render() {
    return(
      <div>


      </div>
    )
  }
}

export default Signup;