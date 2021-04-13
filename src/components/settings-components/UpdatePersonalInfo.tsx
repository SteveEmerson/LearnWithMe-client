import * as React from 'react';

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
}

type UPIProps = {
  user: User
  setSettingsState: Function
  passwordhash: string
}

type UPIState = {
  newEmail: string
  newDisplayName: string
  currPassword: string
  newPassword: string
  hideSetPassword: boolean
}

class UpdatePersonalInfo extends React.Component<UPIProps, UPIState>{
  constructor(props: UPIProps){
    super(props)
    this.state = {
      newEmail: this.props.user.email,
      newDisplayName: this.props.user.displayName,
      currPassword: "",
      newPassword: "",
      hideSetPassword: true
    }
  }
  
  handleSubmitPersonalInfo = (e: React.SyntheticEvent)=> {
    e.preventDefault();
    this.props.setSettingsState(
      {
          displayName: this.state.newDisplayName,
          email: this.state.newEmail,
      })
  }

  nameChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({newDisplayName: e.currentTarget.value})
  }

  emailChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({newEmail: e.currentTarget.value})
  }

  currPasswordChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({currPassword: e.currentTarget.value})
  }

  newPasswordChange = (e: React.FormEvent<HTMLInputElement>) : void => {
    this.setState({newPassword: e.currentTarget.value})
  }

  togglePassword= (e: React.SyntheticEvent)=> {
    e.preventDefault();
    this.setState({hideSetPassword:!this.state.hideSetPassword})
  }

  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmitPersonalInfo}>
          <div>
            <label htmlFor="name"> Display Name:</label>
            <input type="text" name="name" id="name" value={this.state.newDisplayName} onChange={this.nameChange}/>
          </div>
          <div>
            <label htmlFor="email"> School email:</label>
            <input type="text" name="email" id="email" value={this.state.newEmail} onChange={this.emailChange}/>
          </div>
          <div>
            <label htmlFor="showSetPassword"> Password:</label>
            <button 
              id="togglepassword"  
              onClick={this.togglePassword}
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
          <input type="submit" value="Update Info" />
        </form>
      </div>
    )
  }
}

export default UpdatePersonalInfo;