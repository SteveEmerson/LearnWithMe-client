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
    }
  }
  
  handleSubmit = (e: React.SyntheticEvent) : void => {
    e.preventDefault();
    if(this.state.role === ""){
      console.log("Error: No Role Given")
    }else{
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
          localStorage.setItem('sessionToken', user.sessionToken); 
          this.props.setAppState(
            {
                role:user.role,
                displayName: user.displayName,
                userId: user.userId,
                partnerList: [],
                availability: {temp:""}
            })
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      })
    }
  }

  // testSetAppState = () :void =>  {
  //   this.props.setAppState(this.state.sessionToken, 
  //       {
  //         role:this.state.role,
  //         displayName: this.state.displayName,
  //         userId: this.state.userId
  //       }
  //     )
  // }

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
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <p>Role:</p>
            <div>
              <label htmlFor="student"> Student</label>
              <input type="radio" name="role" id="student" value="student" defaultChecked onChange={this.roleChange}/>
            </div>
            <div>
              <label htmlFor="teacher"> Teacher</label>
              <input type="radio" name="role" id="teacher" value="teacher" onChange={this.roleChange}/>
            </div>
          </div>
          <div>
            <label htmlFor="name"> Name (for display):</label>
            <input type="text" name="name" id="name" required onChange={this.nameChange}/>
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
        <br/>
        <hr/>
        <br/>
        <h1> Current Signin State</h1>
        <p>displayName: {this.state.displayName}</p>
        <p>email: {this.state.email}</p>
        <p>password: {this.state.password}</p>
        <p>role: {this.state.role}</p>
      </div>
    )
  }
}

export default Signup;