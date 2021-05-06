import * as React from 'react';
import UpdatePartnerList from './UpdatePartnerList';
import UpdatePersonalInfo from './UpdatePersonalInfo';
import history from '../../history-module/history';
import APIURL from '../../helpers/environment'

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
  newPassword: string
  displayName: string
  partnerList: number[]
  availability: {}
  pInfoChanged: boolean
  partnersChanged: boolean
}

class UpdateSettings extends React.Component<USProps, USState>{
  constructor(props: USProps){
    super(props);
    this.state = {
      email: this.props.user.email,
      passwordhash: "",
      newPassword: "",
      displayName: this.props.user.displayName,
      partnerList: this.props.user.partnerList,
      availability: this.props.user.availability,
      pInfoChanged: false,
      partnersChanged: false
    }
    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getCurrentPasswordHash();
  }

  getCurrentPasswordHash = () => {
    const url: string = `https://${APIURL}/${this.props.user.role}/${this.props.user.userId}`
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


  handleSubmit = (e: React.SyntheticEvent)=> {
    e.preventDefault();

    let reqBody = {
      name: "Jennifer T Emerson",
      email: "jemers@school.edu",
      password: "qwerty",
      partnerList: [1]
  
  }

    let testBody = {
        email: this.state.email, 
        name: this.state.displayName,
        partnerList: this.state.partnerList,
        availability: this.state.availability
      }

    console.log(testBody)

  
    // let reqBody = this.state.newPassword === ""
    // ?
    //   {
    //     email: this.state.email, 
    //     name: this.state.displayName,
    //     partnerList: this.state.partnerList,
    //     availability: this.state.availability
    //   }
    // :
    //   {
    //     email: this.state.email, 
    //     name: this.state.displayName,
    //     partnerList: this.state.partnerList,
    //     availability: this.state.availability,
    //     password: this.state.newPassword
    //   }
    console.log(reqBody)
    const url: string = `https://${APIURL}/${this.props.user.role}/${this.props.user.userId}`
    // console.log(this.props.user.sessionToken);
    fetch(url,
    { 
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': this.props.user.sessionToken
        },
      body: JSON.stringify(reqBody)
      
    })
    .then((res) => res.json())
    .then((user: FetchData) => {
        console.log("Updated Settings", user);
    })
    .catch(err => {
      console.log(`Error in fetch: ${err}`)
    })

    let updatedUser: User = 
      {
        email: this.state.email,
        userId: this.props.user.userId,
        displayName: this.state.displayName,
        partnerList: this.state.partnerList,
        role: this.props.user.role,
        availability: this.state.availability,
        sessionToken: this.props.user.sessionToken
      };
    this.props.setAppState({user: updatedUser});
    history.goBack()
  }
  
  handleCancel = () => {
    this.setState({ 
      email: this.props.user.email,
      displayName: this.props.user.displayName,
      partnerList: this.props.user.partnerList,
      availability: this.props.user.availability,
      pInfoChanged: false,
      partnersChanged: false})
      history.goBack()
  }

  render() {
    return(
      <div className="px-10  pt-20">
        <p className="text-center font-extrabold text-3xl">Settings</p>
        <div className="grid grid-cols-2">
          <div className="flex flex-col items-center">
            <p className="text-center font-extrabold text-xl p-2">Personal Information</p>
            <UpdatePersonalInfo passwordhash={this.state.passwordhash} user={this.props.user} setSettingsState={this.setState}/>
          </div>
          <div>
            <p className="text-center font-extrabold text-xl p-2">Partner List</p>
            <UpdatePartnerList user={this.props.user} setSettingsState={this.setState}/>
          </div>

        </div>
        <button
          className={`m-auto px-2 py-2 flex items-center text-xs uppercase font-bold  text-white bg-red-500 rounded hover:opacity-75 self-center ${!this.state.pInfoChanged && !this.state.partnersChanged ? "hidden" : null}`} 
          
          onClick={this.handleSubmit}
        >
          { this.state.pInfoChanged && this.state.partnersChanged ? "Confirm All Changes"
            : this.state.partnersChanged ? "Confirm Partner Changes"
            : this.state.pInfoChanged ? "Confirm Personal Info Changes"
            : null
          }
        </button>

        <button
          className={`m-auto px-2 py-2 flex items-center text-xs uppercase font-bold  text-white rounded hover:opacity-75 self-center ${!this.state.pInfoChanged && !this.state.partnersChanged ? "hidden" : null}`} 
          
          onClick={this.handleCancel}
        >
          Cancel
        </button>


        
        
        {/* <h3> Current Settings State</h3>
        <p>displayName: {this.state.displayName}</p>
        <p>email: {this.state.email}</p>
        <p>passwordHash: {this.state.passwordhash}</p>
        <p>partnerList: {String(this.state.partnerList)}</p>
        <p>availability: {String(this.state.availability)}</p>
        <p>role: {this.props.user.role}</p> */}
      </div>
    )
  }
}

export default UpdateSettings