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
      allDatabasePartners: [],
      selectedPartner: 0
    }
  }

  componentDidMount(){
    console.log("Mount")
    console.log(this.state.newPartnerList)
    console.log(this.state.newPartnerData)
    this.makeAllDatabasePartnerList();
    this.makeNewPartnerData()
  }

  componentDidUpdate(){
    console.log("Update")
    console.log("Partner List: ",this.state.newPartnerList)
    console.log("Partner Data: ", this.state.newPartnerData)
    console.log("All Database Partner", this.state.allDatabasePartners)

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
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  displayAllDatabasePartners = () => {
    
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

  // handleAddStudentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   this.setState({newPartnerList: [...this.state.newPartnerList, this.state.selectedPartner]})
  // }

  handleAddStudentChange = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value)
    this.setState({selectedPartner: +e.currentTarget.value})
    this.setState({newPartnerList: [...this.state.newPartnerList, this.state.selectedPartner]})
  }

  // displayCurrentPartners = () => {
  //   return (
  //     <div>
        

  //     </div>
     
  //   )
  // }

  render() {
    return(
      <div>
        <h3>Update Partner List</h3>
        <h5>Current Partners</h5>
        <ol>
        {
          this.state.newPartnerData.map((partner: Partner) => {
            return (
                <li key={`Partner${partner.id}`}>{partner.name}
                <button
                  key={`Remove${partner.id}`} 
                  onClick={() =>{
                    let filteredPartnerList: number[] = this.state.newPartnerList.filter(id => id !== partner.id)
                    this.setState({newPartnerList: filteredPartnerList})
                    let filteredPartnerData: Partner[] = this.state.newPartnerData.filter(p => p.id !== partner.id)
                    this.setState({newPartnerData: filteredPartnerData})
                    
                  }}
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
            this.state.allDatabasePartners
            .filter((partner: Partner) => {
              return(
                !this.state.newPartnerList.includes(partner.id)
              )
            })
            .map((partner: Partner) => {
              return(
                <div>
                  <p id={String(partner.id)} key={`AllPartner${partner.id}`}>{partner.name}{partner.id}</p>
                  <button
                    key={`Add${partner.id}`} 
                    onClick={() =>{
                      let filteredPartnerList: Partner[] = this.state.allDatabasePartners.filter(p => p.id !== partner.id)
                      this.setState({allDatabasePartners: filteredPartnerList})
                      this.setState({newPartnerList: [...this.state.newPartnerList, partner.id]})
                      this.setState({newPartnerData: [...this.state.newPartnerData, partner]})
                    }}
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