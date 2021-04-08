import * as React from 'react';
import { useForm } from 'react-hook-form';

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

type FormData = {
  name: string;
  email: string;
  password: string;
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

 const { register, handleSubmit } = useForm<FormData>();

  render() {
    return(
      <div>
        Got to signup
      </div>
    )
  }
}

export default Signup;