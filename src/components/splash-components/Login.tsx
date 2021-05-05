import * as React from 'react';
//import {RouteComponentProps, withRouter} from "react-router-dom"
import APIURL from '../../helpers/environment'

type LoginProps = {
  setAppState: Function
}

type LoginState = {
  email: string
  password: string
  role: string
  signinError: boolean
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps){
    super(props);
    this.state = {
      email: "",
      password: "",
      role: "",
      signinError: false
    }
  }

  
  handleSubmit = (e: React.SyntheticEvent) : void => {
    e.preventDefault();
    if(this.state.role === ""){
      console.log("Error: No Role Given")
    }else{

      const url: string = `http://${APIURL}/${this.state.role}/signin`
      fetch(url,
        {
          method: 'POST',
          body: JSON.stringify({email: this.state.email, password: this.state.password}),
          headers: new Headers ({
            'Content-Type': 'application/json',
          })
        })
        .then((res) => res.json())
        .then((user) => {
          if(user.hasOwnProperty('error')){
            this.setState({signinError: true})
          }else{
            let partners: number[] = (user.studentList) ? user.studentList: user.teacherList;
            this.props.setAppState(
              {
                user:{
                  email: user.email,
                  role: user.role,
                  displayName: user.displayName,
                  userId: user.userId,
                  partnerList: partners,
                  availability: user.availability,
                  sessionToken: user.sessionToken
                }
              })
          }
          
          })
          .catch(err => {
            console.log(`Error in fetch: ${err}`)
          })
          
        }
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
        <p className="text-blue-500 font-bold text-5xl" style={{color:"blue"}}>Welcome back!</p>
        <form className="flex flex-col space-y-6" onSubmit={this.handleSubmit}>
          <div className="flex flex-row space-x-5 self-center">
            <p className="font-bold">Role</p>
            <div>
              <label className="p-4" htmlFor="student"> Student</label>
              <input type="radio" name="role" id="student" value="student" required onChange={this.roleChange}/>
            </div>
            <div>
              <label className="p-4" htmlFor="teacher"> Teacher</label>
              <input type="radio" name="role" id="teacher" value="teacher" required onChange={this.roleChange}/>
            </div>
          </div>
          <div className="self-center space-x-4">
            <label className="font-bold" htmlFor="email"> School email</label>
            <input className="text-xl text-black px-2 py-1" type="text" name="email" id="email" required onChange={this.emailChange}/>
          </div>
          <div className="self-center space-x-4">
            <label className="font-bold" htmlFor="password"> Password</label>
            <input className="text-xl text-black px-2 py-1" type="password" name="password" id="password" required onChange={this.passwordChange}/>
          </div>
          <input
            className="px-2 py-1 self-center flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75"
            style={{backgroundColor:"blue"}}
            type="submit" 
            value="Submit" 
          />
        </form>

        {this.state.signinError ? <h5>Login error. User not found.</h5> : null}

        {/* <h1> Current Login State</h1>
        <p>email: {this.state.email}</p>
        <p>password: {this.state.password}</p>
        <p>role: {this.state.role}</p> */}
      </div>
    )
  }
}

export default Login;