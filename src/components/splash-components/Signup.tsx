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

handleSubmit(event: Event) { // not sure this is right, but everything needs typed yo!
    event.preventDefault();
  }
  render() {
    // NOTE ... COULD TRY USING FORMIK FOR THIS WHEN GET TO STYLING
    return(
      <div>


      </div>
    )
  }
}

export default Signup;