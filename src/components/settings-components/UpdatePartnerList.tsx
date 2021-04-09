import * as React from 'react';


type User = {
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability?: {temp?:any}
}

type UPLProps = {
  user: User
  setSettingsState: Function

}

type UPLState = {
  newPartnerList: number[]
  newPartnerData: Array<Partner>
  allDatabasePartners: Array<Partner>
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
      allDatabasePartners: []
    }
  }

  componentDidMount(){
    this.makeAllDatabasePartnerList();
    this.makeNewPartnerData()
  }

  makeAllDatabasePartnerList = () => {

    let partnerRole = (this.props.user.role === 'teacher'? "student": "teacher")
    const url: string = `http://localhost:3000/${partnerRole}/`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': String(localStorage.getItem('sessionToken'))
          })
      })
      .then((res) => res.json())
      .then((data: AllPartners) => {
        let allPartners: Array<Partner> = data.map((partner:FetchUserData) => {
          return {id: partner.id, name: partner.name}
        })
        this.setState({allDatabasePartners: allPartners})
        console.log(this.state.allDatabasePartners)
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }


  makeNewPartnerData = () => {
    for(let id of this.state.newPartnerList){
      let partnerRole = (this.props.user.role === 'teacher'? "student": "teacher")
      const url: string = `http://localhost:3000/${partnerRole}/${id}`
      fetch(url,
        {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': String(localStorage.getItem('sessionToken'))
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

  displayCurrentPartners = () => {
    return (
      <div>
        <h5>Current Partners</h5>
        {
          this.state.newPartnerData.map((partner: Partner) => {
            return (
              <div>
                <span>{partner.name}</span>
                <button 
                  onClick={() =>{
                    let filteredPartnerList: number[] = this.state.newPartnerList.filter(id => id !== partner.id)
                    this.setState({newPartnerList: filteredPartnerList})
                  }}
                  >
                  remove
                </button>
              </div>
            )
          })
        }

      </div>
     
    )
  }

  render() {
    return(
      <div>
        <h3>Update Partner List</h3>
        
        {this.displayCurrentPartners()}
        <h5>All Database Partners</h5>
        {this.state.allDatabasePartners.map((partner: Partner) => <p>{partner.name}</p>)}
      </div>
    )
  }
}

export default UpdatePartnerList