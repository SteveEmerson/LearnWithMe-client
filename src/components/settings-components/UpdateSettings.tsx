import * as React from 'react';
import UpdatePartnerList from './UpdatePartnerList';
import UpdatePersonalInfo from './UpdatePersonalInfo';

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
  displayName: string
  partnerList: number[]
  availability: {}
}

class UpdateSettings extends React.Component<USProps, USState>{
  constructor(props: USProps){
    super(props);
    this.state = {
      email: this.props.user.email,
      passwordhash: "",
      displayName: this.props.user.displayName,
      partnerList: this.props.user.partnerList,
      availability: this.props.user.availability,
    }
    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getCurrentPasswordHash();
  }

  getCurrentPasswordHash = () => {
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


  handleSubmit = (e: React.SyntheticEvent)=> {
    e.preventDefault();
    const url: string = `http://localhost:3000/${this.props.user.role}/${this.props.user.userId}`
    // console.log(this.props.user.sessionToken);
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
          partnerList: this.state.partnerList,
          availability: this.state.availability
        })
      
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
  }

  render() {
    return(
      <div className="p-10">
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
          <button onClick={this.handleSubmit}>Confirm Changes</button>
        </div>
        
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