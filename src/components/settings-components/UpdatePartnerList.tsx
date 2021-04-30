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
    this.makeAllDatabasePartnerList();
  }

  componentDidUpdate(){

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
    let tempNew: Array<Partner> = this.state.newPartnerData;
    tempNew.push(partner);
    this.setState({newPartnerData: tempNew});
    let filteredAllPartnerData: Array<Partner> = this.state.allDatabasePartnerData.filter(p => p !== partner);
    this.setState({allDatabasePartnerData: filteredAllPartnerData});
  }

  handleRemovePartner = (partner: Partner) => {
    let tempAll: Array<Partner> = this.state.allDatabasePartnerData;
    tempAll.push(partner);
    this.setState({allDatabasePartnerData: tempAll});
    let filteredPartnerData: Array<Partner> = this.state.newPartnerData.filter(p => p !== partner);
    this.setState({newPartnerData: filteredPartnerData});
  }
  
  handleSubmitPartners = () => {
    let newPartners: number[] = this.state.newPartnerData.map((partner: Partner) => partner.id);
    this.props.setSettingsState({partnerList: newPartners});

  }
  render() {
    let changes: boolean = true;
    return(
      <div >
        <div className="grid grid-cols-2 gap-20">
          <div>
            <p className="text-lg py-4 font-semibold">Current Partners</p>
            {
              this.state.newPartnerData.map((partner: Partner) => {
                return (
                  <div className="py-1">
                    <div className="flex flex-row justify-between">
                      <p key={`Partner${partner.id}`}>{partner.name}</p>
                      <button
                        className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"
                        key={`Remove${partner.id}`}
                        value={partner.id}
                        onClick={() => this.handleRemovePartner(partner)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                )
              })
            }
          </div>
          
          <div>
            <p className="text-lg py-4 font-semibold" >Other Partners</p>
              {
                this.state.allDatabasePartnerData.map((partner: Partner) => {
                  return(
                    <div className="py-1" key={`P${partner.id}`}>
                      <div className="flex flex-row justify-between">
                        <p key={`AllPartner${partner.id}`}>{partner.name}{partner.id}</p>
                        <button
                          className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"
                          key={`Add${partner.id}`} 
                          onClick={() =>{this.handleAddPartner(partner)}}
                        >
                          add
                        </button>
                      </div>
                    </div>
                  ) 
                })
              }
          </div>
        </div>
        <div className="py-6">
          <button
            className={`m-auto px-2 py-2 flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75 self-center ${!changes ? "hidden" : null}`} 
            onClick={this.handleSubmitPartners}
          >
            Update Partner List
          </button>
        </div>
      </div>
    )
  }
}

export default UpdatePartnerList