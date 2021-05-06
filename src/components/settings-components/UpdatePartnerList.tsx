import * as React from 'react';
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

type UPLProps = {
  user: User
  setSettingsState: Function

}

type UPLState = {
  currentPartnerIdList: number[]
  otherPartnerIdList: number[]
  newPartnerData: Array<Partner>
  allDatabasePartnerData: Array<Partner>
  gotAllPartners: boolean
  gotNewPartners: boolean
  changes: boolean
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
      currentPartnerIdList: [],
      otherPartnerIdList: [],
      newPartnerData: [],
      allDatabasePartnerData: [],
      gotAllPartners: false,
      gotNewPartners: false,
      changes: false
    }

  }

  componentDidMount(){
    this.makeAllDatabasePartnerList();
    
  }

  componentDidUpdate(prevProps: UPLProps, prevState: UPLState){
  }

  checkPartnerChanged = (idList: number[], partnerList: Array<Partner>) => {
    let changed: boolean = false;

    if(idList.length !== partnerList.length) {changed = true}
    
    partnerList.forEach((partner: Partner) => {
      if(!idList.includes(partner.id)) {changed = true}
    })

    return changed
  }

  makeAllDatabasePartnerList = () => {
    let partnerRole = (this.props.user.role === 'teacher'? "student": "teacher")
    const url: string = `${APIURL}/${partnerRole}/`
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
        this.setState({gotAllPartners: true})

        let newPartners: Array<Partner> = 
        data.map((partner: FetchUserData) => {
          return {id: partner.id, name: partner.name}
        })
        .filter((partner: Partner) => this.props.user.partnerList.includes(partner.id))

        this.setState({newPartnerData: newPartners})
        this.setState({gotNewPartners: true})

        let otherPartIdList: number[] = allPartners.map((partner: Partner) => partner.id)
        this.setState({otherPartnerIdList: otherPartIdList})

        let currPartIdList: number[] = newPartners.map((partner: Partner) => partner.id)
        this.setState({currentPartnerIdList: currPartIdList})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }


  handleAddPartner = (partner: Partner) => {
    let tempNew: Array<Partner> = this.state.newPartnerData;
    tempNew.push(partner);
    this.setState({newPartnerData: tempNew});
    let filteredAllPartnerData: Array<Partner> = this.state.allDatabasePartnerData.filter(p => p !== partner);
    this.setState({allDatabasePartnerData: filteredAllPartnerData});

    let currChanged: boolean =this.checkPartnerChanged(this.state.currentPartnerIdList, this.state.newPartnerData)


    this.setState({changes: currChanged})
  }

  handleRemovePartner = (partner: Partner) => {
    let tempAll: Array<Partner> = this.state.allDatabasePartnerData;
    tempAll.push(partner);
    this.setState({allDatabasePartnerData: tempAll});
    let filteredPartnerData: Array<Partner> = this.state.newPartnerData.filter(p => p !== partner);
    this.setState({newPartnerData: filteredPartnerData});

    let currChanged: boolean =this.checkPartnerChanged(this.state.currentPartnerIdList, this.state.newPartnerData)
    let otherChanged: boolean = this.checkPartnerChanged(this.state.otherPartnerIdList, this.state.allDatabasePartnerData)

    this.setState({changes: currChanged || otherChanged})
  }
  
  handleSubmitPartners = () => {
    let newPartners: number[] = this.state.newPartnerData.map((partner: Partner) => partner.id);
    this.props.setSettingsState({partnerList: newPartners, partnersChanged: true});

  }
  render() {
    return(
      <div >
        <div className="grid grid-cols-2 gap-20">
          <div>
            <p className="text-lg py-4 font-semibold">Current Partners</p>
            {
              this.state.newPartnerData.map((partner: Partner) => {
                return (
                  <div className="py-1" key={`NP${partner.id}`}>
                    <div className="flex flex-row justify-between">
                      <p>{partner.name}</p>
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
            <p className="text-lg py-4 font-semibold" >
              Other {this.props.user.role === "teacher" ? "Students" : "Teachers"}
            </p>
              {
                this.state.allDatabasePartnerData.map((partner: Partner) => {
                  return(
                    <div className="py-1" key={`AP${partner.id}`}>
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
            className={`m-auto px-2 py-2 flex items-center text-xs uppercase font-bold  text-white bg-blue-500 rounded hover:opacity-75 self-center ${!this.state.changes ? "hidden" : null}`}
            style={{backgroundColor:"blue"}}
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