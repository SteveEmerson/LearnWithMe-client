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
      <div style={{textAlign:'left', marginLeft:'50px'}}>
        <h2>Signup</h2>
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

        {this.state.signinError ? <h5>Email not available.</h5> : null}
      </div>
    )
  }
}

export default Signup;