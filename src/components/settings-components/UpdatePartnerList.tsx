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
  newPartnerList: number[]
  newPartnerData: Array<Partner>
  allDatabasePartnerData: Array<Partner>
  selectedPartner: number
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
      newPartnerList: this.props.user.partnerList,
      newPartnerData: [],
      allDatabasePartnerData: [],
      selectedPartner: 0
    }
  }

  componentDidMount(){
    console.log("Mount")
    console.log("Partner List on Mount", this.state.newPartnerList)
    console.log("Partner Data on Mount", this.state.newPartnerData)
    console.log("All Database Partner on Mount", this.state.allDatabasePartnerData)

    this.makeAllDatabasePartnerList();
    // this.makeNewPartnerData()
  }

  componentDidUpdate(){
    console.log("Update")
    console.log("Partner List: ",this.state.newPartnerList)
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

  // displayAllDatabasePartners = () => {
    
  // }

  // displayCurrentPartners = () => {
  //   return (
  //     <div>
        

  //     </div>
     
  //   )
  // }


  makeNewPartnerData = () => {
    for(let id of this.state.newPartnerList){
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

  // handleAddStudentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   this.setState({newPartnerList: [...this.state.newPartnerList, this.state.selectedPartner]})
  // }

  handleAddStudent = (partner: Partner) => {
    console.log(partner)
    let tempNew: Array<Partner> = this.state.newPartnerData;
    tempNew.push(partner);
    this.setState({newPartnerData: tempNew});
    let filteredAllPartnerData: Array<Partner> = this.state.allDatabasePartnerData.filter(p => p !== partner);
    this.setState({allDatabasePartnerData: filteredAllPartnerData});
  }

  // THIS WORKS AS OF 4.12 AM
  handleRemoveStudent = (partner: Partner) => {
    console.log(partner)
    let tempAll: Array<Partner> = this.state.allDatabasePartnerData;
    tempAll.push(partner);
    this.setState({allDatabasePartnerData: tempAll});
    let filteredPartnerData: Array<Partner> = this.state.newPartnerData.filter(p => p !== partner);
    this.setState({newPartnerData: filteredPartnerData});
  }

  render() {
    return(
      <div>
        <h5>Current Partners</h5>
        <ol>
        {
          this.state.newPartnerData.map((partner: Partner) => {
            return (
                <li key={`Partner${partner.id}`}>{partner.name}
                <button
                  key={`Remove${partner.id}`}
                  value={partner.id}
                  onClick={() => this.handleRemoveStudent(partner)}
                  >
                  remove
                </button>
                </li>
            )
          })
        }
        </ol>
        <h5>All Database Partners</h5>
        
          {
            this.state.allDatabasePartnerData
            .map((partner: Partner) => {
              return(
                <div>
                  <p id={String(partner.id)} key={`AllPartner${partner.id}`}>{partner.name}{partner.id}</p>
                  <button
                    key={`Add${partner.id}`} 
                    onClick={() =>{this.handleAddStudent(partner)}}
                    >
                    add
                  </button>
                </div>
              ) 
            })
          }
   
      </div>
    )
  }
}

export default UpdatePartnerList