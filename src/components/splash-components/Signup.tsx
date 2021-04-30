import * as React from 'react';

type SignupProps = {
  setAppState: Function
}

type User = {
  userId: number
  displayName: string
  role: string
  sessionToken: string
}

type SignupState = {
  email: string
  password: string
  role: string
  displayName: string
  signinError: boolean
}

// type FormData = {
//   name: string;
//   email: string;
//   password: string;
// }

class Signup extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps){
    super(props);
    this.state = {
      email: "",
      password: "",
      role: "",
      displayName: "",
      signinError: false
    }
  }
  
  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const url: string = `http://localhost:3000/${this.state.role}/register`
    fetch(url,
    {
        method: 'POST',
        body: JSON.stringify({email: this.state.email, password: this.state.password, name:this.state.displayName}),
        headers: new Headers ({
        'Content-Type': 'application/json',
        })
    })
    .then((res) => res.json())
    .then((user: User) => {
      console.log(user);
        if(user.hasOwnProperty('error')){
          this.setState({signinError: true})
        }else{
          this.props.setAppState(
            {
              user:{
                role:user.role,
                displayName: user.displayName,
                userId: user.userId,
                partnerList: [],
                availability: {},
                sessionToken: user.sessionToken
              }
            })
          this.setState({signinError: false})
        }
    })
    .catch(err => {
      console.log(`Error in fetch: ${err}`)
    })
  }

  nameChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({displayName: e.currentTarget.value})
  }

  emailChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({email: e.currentTarget.value})
  }

  passwordChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({password: e.currentTarget.value})
  }

  roleChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({role: e.currentTarget.value})
  }


  render() {
    return(
      <div className="px-10 py-40 text-3xl flex flex-col space-y-4 items-center">
        <p className="text-blue-500 font-bold text-5xl">Welcome to LearnWithMe</p>
        <form className="flex flex-col space-y-6" onSubmit={this.handleSubmit}>
          <div className="flex flex-row space-x-5 self-center">
            <p className="font-bold">Role</p>
            <div>
              <label className="p-4" htmlFor="student">Student</label>
              <input type="radio" name="role" id="student" value="student" required onChange={this.roleChange}/>
            </div>
            <div>
              <label className="p-4" htmlFor="teacher">Teacher</label>
              <input type="radio" name="role" id="teacher" value="teacher" required onChange={this.roleChange}/>
            </div>
          </div>
          <div className="self-center space-x-4">
            <label className="font-bold" htmlFor="name">Display Name</label>
            <input className="text-xl text-black px-2 py-1" type="text" name="name" id="name" required onChange={this.nameChange}/>
          </div>
          <div className="self-center space-x-4">
            <label className="font-bold" htmlFor="email">School email</label>
            <input className="text-xl text-black px-2 py-1" type="text" name="email" id="email" required onChange={this.emailChange}/>
          </div>
          <div className="self-center space-x-4">
            <label className="font-bold" htmlFor="password">Password</label>
            <input className="text-xl text-black px-2 py-1" type="text" name="password" id="password" required onChange={this.passwordChange}/>
          </div>
          <input
            className="px-2 py-1 self-center flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75"
            type="submit" 
            value="Submit" 
          />
        </form>

        {this.state.signinError ? <h5>Email not available.</h5> : null}
      </div>
    )
  }
}

export default Signup;