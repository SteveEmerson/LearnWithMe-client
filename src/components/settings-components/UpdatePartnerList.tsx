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

type UPLProps = {
  user: User
  setSettingsState: Function

}

type UPLState = {
  // newPartnerList: number[]
  newPartnerData: Array<Partner>
  allDatabasePartnerData: Array<Partner>
}

type Partner = {
  id: number
  name: string
}

type FetchUserData = {
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

type AllPartners = Array<FetchUserData>

class UpdatePartnerList extends React.Component<UPLProps, UPLState>{
  constructor(props: UPLProps){
    super(props)
    this.state = {
      // newPartnerList: this.props.user.partnerList,
      newPartnerData: [],
      allDatabasePartnerData: []
    }

  }

  componentDidMount(){
    console.log("Mount")
    // console.log("Partner List on Mount", this.state.newPartnerList)
    console.log("Partner Data on Mount", this.state.newPartnerData)
    console.log("All Database Partner on Mount", this.state.allDatabasePartnerData)

    this.makeAllDatabasePartnerList();
    // this.makeNewPartnerData()
  }

  componentDidUpdate(){
    console.log("Update")
    // console.log("Partner List: ",this.state.newPartnerList)
    console.log("Partner Data: ", this.state.newPartnerData)
    console.log("All Database Partner", this.state.allDatabasePartnerData)
  }

  makeAllDatabasePartnerList = () => {
    let partnerRole = (this.props.user.role === 'teacher'? "student": "teacher")
    const url: string = `http://localhost:3000/${partnerRole}/`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.user.sessionToken
          })
      })
      .then((res) => res.json())
      .then((data: AllPartners) => {
        let allPartners: Array<Partner> = 
        data.map((partner:FetchUserData) => {
          return {id: partner.id, name: partner.name}
        })
        .filter((partner: Partner) => !this.props.user.partnerList.includes(partner.id))

        this.setState({allDatabasePartnerData: allPartners})

        let newPartners: Array<Partner> = 
        data.map((partner: FetchUserData) => {
          return {id: partner.id, name: partner.name}
        })
        .filter((partner: Partner) => this.props.user.partnerList.includes(partner.id))
        this.setState({newPartnerData: newPartners})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  makeNewPartnerData = () => {
    for(let id of this.props.user.partnerList){
      let partnerRole = (this.props.user.role === 'teacher'? "student": "teacher")
      const url: string = `http://localhost:3000/${partnerRole}/${id}`
      fetch(url,
        {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.user.sessionToken
          })
        })
        .then((res) => res.json())
        .then((data: FetchUserData) => {
          return {id: data.id, name: data.name}
        })
        .then((partner: Partner) =>  this.state.newPartnerData.push(partner))
        .catch(err => {
          console.log(`Error in user fetch: ${err}`)
        }) 
    }
  }


  handleAddPartner = (partner: Partner) => {
    console.log(partner)
    let tempNew: Array<Partner> = this.state.newPartnerData;
    tempNew.push(partner);
    this.setState({newPartnerData: tempNew});
    let filteredAllPartnerData: Array<Partner> = this.state.allDatabasePartnerData.filter(p => p !== partner);
    this.setState({allDatabasePartnerData: filteredAllPartnerData});
  }

  handleRemovePartner = (partner: Partner) => {
    console.log(partner)
    let tempAll: Array<Partner> = this.state.allDatabasePartnerData;
    tempAll.push(partner);
    this.setState({allDatabasePartnerData: tempAll});
    let filteredPartnerData: Array<Partner> = this.state.newPartnerData.filter(p => p !== partner);
    this.setState({newPartnerData: filteredPartnerData});
  }
  
  handleSubmitPartners = () => {
    let newPartners: number[] = this.state.newPartnerData.map((partner: Partner) => partner.id);
    console.log(newPartners);
    this.props.setSettingsState({partnerList: newPartners});

  }
  render() {
    return(
      <div>
        <h5>Current Partners</h5>

        {
          this.state.newPartnerData.map((partner: Partner) => {
            return (
              <div>
                <span key={`Partner${partner.id}`}>{partner.name}</span>
                <button
                  key={`Remove${partner.id}`}
                  value={partner.id}
                  onClick={() => this.handleRemovePartner(partner)}
                  >
                  remove
                </button>
              </div>
            )
          })
        }

        <h5>All Database Partners</h5>
        
          {
            this.state.allDatabasePartnerData
            .map((partner: Partner) => {
              return(
                <div>
                  <span id={String(partner.id)} key={`AllPartner${partner.id}`}>{partner.name}{partner.id}</span>
                  <button
                    key={`Add${partner.id}`} 
                    onClick={() =>{this.handleAddPartner(partner)}}
                    >
                    add
                  </button>
                </div>
              ) 
            })
          }

          <br/>
          <button onClick={this.handleSubmitPartners}>Update Partner List</button>
   
      </div>
    )
  }
}

export default UpdatePartnerList