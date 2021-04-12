import * as React from 'react';
// import UpdatePartnerList from './UpdatePartnerList'
//import fetch, {Headers} from 'node-fetch';

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
}

type FetchData = {
  id: number,
  email: string,
  passwordhash: string,
  name: string,
  studentList?: number[],
  teacherList?: number[]
  role: string,
  availability: {},
  createdAt: string,
  updatedAt: string
}

type USProps = {
  user: User
  setAppState: Function
}

type USState = {
  email: string
  passwordhash: string
  currPassword: string
  newPassword: string
  displayName: string
  partnerList: number[]
  availability?: {temp?: any}
  hideSetPassword: boolean
}

class UpdateSettings extends React.Component<USProps, USState>{
  constructor(props: USProps){
    super(props);
    this.state = {
      email: this.props.user.email,
      passwordhash: "",
      currPassword: "",
      newPassword: "",
      displayName: this.props.user.displayName,
      partnerList: this.props.user.partnerList,
      availability: this.props.user.availability,
      hideSetPassword: true
    }
  }

  componentDidMount(){
    const url: string = `http://localhost:3000/${this.props.user.role}/${this.props.user.userId}`

    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.user.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: FetchData) => {
        this.setState(
          {
              passwordhash: data.passwordhash,
          })
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  togglePssword= (e: React.SyntheticEvent)=> {
    e.preventDefault();
    this.setState({hideSetPassword:!this.state.hideSetPassword})

  }

  renderPersonalInfoForm = () =>  {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name"> Display Name:</label>
            <input type="text" name="name" id="name" value={this.state.displayName} onChange={this.nameChange}/>
          </div>
          <div>
            <label htmlFor="email"> School email:</label>
            <input type="text" name="email" id="email" value={this.state.email} onChange={this.emailChange}/>
          </div>
          <div>
            <label htmlFor="showSetPassword"> Password:</label>
            <button 
              id="togglepassword"  
              onClick={this.togglePssword}
            >
              {(this.state.hideSetPassword ? "update" : "cancel")}
            </button>
            <div hidden={this.state.hideSetPassword}>
              <label htmlFor="currpassword"> Current Password:</label>
              <input type="text" name="currpassword" id="currpassword" onChange={this.currPasswordChange}/>
              <label htmlFor="password"> New Password:</label>
              <input type="text" name="newpassword" id="newpassword" value={this.state.newPassword} onChange={this.newPasswordChange}/>
            </div>

          </div>
          <input type="submit" value="Submit" />
        </form>
        {/* <div>
          <UpdatePartnerList user={this.props.user} setSettingsState={this.setState}/>
        </div> */}
      </div>
    )
  }

  handleSubmit = (e: React.SyntheticEvent)=> {
    e.preventDefault();
    const url: string = `http://localhost:3000/${this.props.user.role}/${this.props.user.userId}`
    console.log(this.props.user.sessionToken);
    fetch(url,
    { 
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': this.props.user.sessionToken
        },
      body: JSON.stringify(
        {
          email: this.state.email, 
          name: this.state.displayName,
          //password: this.state.newPassword  //coming in version 2.0

        })
      
    })
    .then((res) => res.json())
    .then((user: User) => {
        console.log("Updated Settings", user);
        this.props.setAppState(
          {
              displayName: user.displayName,
              userId: user.userId,
              partnerList: user.partnerList,
              availability: user.availability
          })
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

  currPasswordChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({currPassword: e.currentTarget.value})
  }

  newPasswordChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({newPassword: e.currentTarget.value})
  }

  render() {
    console.log(this.props.user)
    return(
      <div style={{textAlign:'left', marginLeft:'50px'}}>
        <h1>Update Settings</h1>
        <h3>Update Personal Information</h3>
        {this.renderPersonalInfoForm()}
        <hr/>
        <h3> Current Settings State</h3>
        <p>displayName: {this.state.displayName}</p>
        <p>email: {this.state.email}</p>
        <p>passwordHash: {this.state.passwordhash}</p>
        <p>currPassword: {this.state.currPassword}</p>
        <p>newPassword: {this.state.newPassword}</p>
        <p>partnerList: {String(this.state.partnerList)}</p>
        <p>availability: {String(this.state.availability)}</p>
        <p>role: {this.props.user.role}</p>
      </div>
    )
  }
}

export default UpdateSettings