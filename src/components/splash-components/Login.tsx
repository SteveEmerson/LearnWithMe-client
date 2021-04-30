import * as React from 'react';
//import {RouteComponentProps, withRouter} from "react-router-dom"

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

      const url: string = `http://localhost:3000/${this.state.role}/signin`
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
          console.log(user);
          if(user.hasOwnProperty('error')){
            this.setState({signinError: true})
          }else{
            let partners: number[] = (user.studentList) ? user.studentList: user.teacherList;
            //console.log(partners)
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
      <div>
        <p>Login</p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <p>Role:</p>
            <div>
              <label htmlFor="student"> Student</label>
              <input type="radio" name="role" id="student" value="student" required onChange={this.roleChange}/>
            </div>
            <div>
              <label htmlFor="teacher"> Teacher</label>
              <input type="radio" name="role" id="teacher" value="teacher" required onChange={this.roleChange}/>
            </div>
          </div>
          <div>
            <label htmlFor="email"> School email:</label>
            <input type="text" name="email" id="email" required onChange={this.emailChange}/>
          </div>
          <div>
            <label htmlFor="password"> Password:</label>
            <input type="text" name="password" id="password" required onChange={this.passwordChange}/>
          </div>
          <input type="submit" value="Submit" />
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