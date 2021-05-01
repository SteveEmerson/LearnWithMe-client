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
  
  // checkChanges = () => {
  //   let changes: boolean = 
  //   this.state.newDisplayName !== this.props.user.displayName ||
  //   this.state.newEmail !== this.props.user.email ||
  //   this.state.newPassword !== ""

  //   this.props.setSettingsState({pInfoChanged: changes})

  //   return changes;
  // }

  handleSubmitPersonalInfo = (e: React.SyntheticEvent)=> {
    e.preventDefault();
    this.props.setSettingsState(
      {
          displayName: this.state.newDisplayName,
          email: this.state.newEmail,
          pInfoChanged: true
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
    let changes: boolean = 
    this.state.newDisplayName !== this.props.user.displayName ||
    this.state.newEmail !== this.props.user.email ||
    this.state.newPassword !== ""

    return(
      <div className="text-lg p-4">
        <form className="flex flex-col space-y-3" onSubmit={this.handleSubmitPersonalInfo}>
          <div>
            <label className="p-4 font-semibold" htmlFor="name"> Display name</label>
            <input className="text-black text-base px-1" type="text" name="name" id="name" value={this.state.newDisplayName} onChange={this.nameChange}/>
          </div>
          <div>
            <label className="p-4 font-semibold" htmlFor="email"> School email</label>
            <input className="text-black text-base px-1" type="text" name="email" id="email" value={this.state.newEmail} onChange={this.emailChange}/>
          </div>
          <div>
            <div className="flex flex-row items-center">
              <label className="p-4 font-semibold" htmlFor="showSetPassword"> Password</label>
              <button
                className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"
                id="togglepassword"  
                onClick={this.togglePassword}
              >
                {(this.state.hideSetPassword ? "update" : "cancel")}
              </button>
            </div>
            <div className={`flex flex-col space-y-3 ml-3 ${this.state.hideSetPassword ? "hidden" : null}`} >
              <div>
                <label className="p-4" htmlFor="currpassword"> Current Password</label>
                <input className="text-black text-base px-1" type="text" name="currpassword" id="currpassword" onChange={this.currPasswordChange}/>
              </div>
              <div>
                <label className="p-4" htmlFor="password"> New Password</label>
                <input className="text-black text-base  px-1" type="text" name="newpassword" id="newpassword" value={this.state.newPassword} onChange={this.newPasswordChange}/>
              </div>
            </div>

          </div>
          <input
            className={`px-2 py-2 flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75 self-center ${!changes ? "hidden" : null}`}
            type="submit" 
            value="update personal info" 
          />
        </form>
      </div>
    )
  }
}

export default UpdatePersonalInfo;