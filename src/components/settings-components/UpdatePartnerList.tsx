import * as React from 'react';

type UPLProps = {
  currPartnerList: number[]
  setSettingsState: Function
  role: string
}

type UPLState = {
  newPartners: number[]
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
      newPartners: this.props.currPartnerList,
      allDatabasePartners: []
    }
  }

  componentDidMount(){
    this.makeAllDatabasePartnerList();
    
  }

  makeAllDatabasePartnerList = (): void => {

    let partnerRole = (this.props.role === 'teacher'? "student": "teacher")
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


  // makeNewPartnerList = () => {
  //   for(id in )
  // }

  getPartner(id: number){
    let partnerRole = (this.props.role === 'teacher'? "student": "teacher")
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
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  render() {
    return(
      <div>
        <h3>Update Partner List</h3>
        <h5>All Database Partners</h5>
        {this.state.allDatabasePartners.map((partner: Partner) => {return <p>{partner.name}</p>})}
      </div>
    )
  }
}

export default UpdatePartnerList