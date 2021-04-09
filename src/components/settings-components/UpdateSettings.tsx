import * as React from 'react';
import UpdatePartnerList from './UpdatePartnerList'
//import fetch, {Headers} from 'node-fetch';

type User = {
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability?: {temp?:any}
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
  userId: number
  role: string
  setAppState: Function
}

type USState = {
  email: string,
  passwordhash: string,
  currPassword: string
  newPassword: string,
  displayName: string
  partnerList: number[] | undefined
  availability?: {temp?: any}
  hideSetPassword: boolean
}

class UpdateSettings extends React.Component<USProps, USState>{
  constructor(props: USProps){
    super(props);
    this.state = {
      email: "",
      passwordhash: "",
      currPassword: "",
      newPassword: "",
      displayName: "",
      partnerList: [],
      availability: {},
      hideSetPassword: true
    }
  }

  componentDidMount(){
    const url: string = `http://localhost:3000/${this.props.role}/${this.props.userId}`

    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': String(localStorage.getItem('sessionToken'))
          })
      })
      .then((res) => res.json())
      .then((data: FetchData) => {
        console.log(data)
          this.setState(
            {
                email: data.email,
                passwordhash: data.passwordhash,
                displayName: data.name,
                partnerList: 
                  (data.role === "teacher") ? data.teacherList: data.studentList,
                availability: data.availability
            })
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  renderForm = () =>  {

    let currPartnerList: number[] = (this.state.partnerList) ? this.state.partnerList : [];

    return(
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
            id="email" 
            value={this.state.email} 
            onClick={() => this.setState({hideSetPassword:!this.state.hideSetPassword})}
          >
            {(this.state.hideSetPassword ? "update" : "cancel")}
          </button>
          <div hidden={this.state.hideSetPassword}>
            <label htmlFor="currpassword"> Current Password:</label>
            <input type="text" name="currpassword" id="currpassword" onChange={this.currPasswordChange}/>
            <label htmlFor="password"> New Password:</label>
            <input type="text" name="newpassword" id="newpassword" value={this.state.newPassword} onChange={this.newPasswordChange}/>
          </div>
          <div>
            <UpdatePartnerList role={this.props.role} currPartnerList={currPartnerList} setSettingsState={this.setState}/>
          </div>
        </div>
        <input type="submit" value="Submit" />
      </form>
    )
  }

  handleSubmit = (e: React.SyntheticEvent) : void => {
    e.preventDefault();
    const url: string = `http://localhost:3000/${this.props.role}/register`
    fetch(url,
    {
        method: 'PUT',
        body: JSON.stringify(
          {
            email: this.state.email, 
            name:this.state.displayName, 
            partnerList: this.state.partnerList, }),
        headers: new Headers ({
        'Content-Type': 'application/json',
        })
    })
    .then((res) => res.json())
    .then((user: User) => {
        console.log(user);
        this.props.setAppState(
          {
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
    return(
      <div style={{textAlign:'left', marginLeft:'50px'}}>
        <h1>Update Settings</h1>
        {this.renderForm()}
        <hr/>
        <h3> Current Settings State</h3>
        <p>displayName: {this.state.displayName}</p>
        <p>email: {this.state.email}</p>
        <p>passwordHash: {this.state.passwordhash}</p>
        <p>currPassword: {this.state.currPassword}</p>
        <p>newPassword: {this.state.newPassword}</p>
        <p>partnerList: {this.state.partnerList}</p>
        <p>availability: {String(this.state.availability)}</p>
        <p>role: {this.props.role}</p>
      </div>
    )
  }
}

export default UpdateSettings