import * as React from 'react';
import StudentCardFull from '../student-components/StudentCardFull';
import StudentCardSmall from '../student-components/StudentCardSmall';

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
}

type Student = {
  id: number
  displayName: string
  meetings?:number[]
  goals?:number[]
}

type TSVProps = {
  user: User
}

type TSVState = {
  currStudent: Student | null
  allTeacherStudents: Array<Student>
}

type FetchUserData = {
  id: number,
  email: string,
  passwordhash: string,
  name: string,
  teacherList: number[]
  role: string,
  availability: {},
  createdAt: string,
  updatedAt: string
}

type AllPartners = Array<FetchUserData>

class TeacherStudentView extends React.Component<TSVProps,TSVState>{
  constructor(props: TSVProps){
    super(props)
    this.state = {
      currStudent: null,
      allTeacherStudents: []
    }

    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getStudentList();
  }


  getStudentList = () => {
    const url: string = `http://localhost:3000/student/`
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
        let allStudents: Array<Student> = 
        data.filter((partner:FetchUserData) => {
          return this.props.user.partnerList.includes(partner.id)
        })
        .map((partner: FetchUserData) => {
          return {id: partner.id, displayName: partner.name}
        } )
        this.setState({allTeacherStudents: allStudents})
        this.setState({currStudent: allStudents[0]})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  renderStudentList = () => {
    return(
      this.state.allTeacherStudents.map((student: Student) => {
        return(
          <StudentCardSmall student={student} setTSVState = {this.setState}/>
        )
      })
    )
  }

  render() {
    return(
      <div> 
        <h3>Teacher Student View</h3>
        <div className="StudentCardFull">
          {this.state.currStudent ? <StudentCardFull student={this.state.currStudent}/> : null}
        </div>
        <div className="StudentCardSmallList">
          {this.state.allTeacherStudents.length !== 0 ? this.renderStudentList() : null}
        </div>
      <hr/>
      </div>
      
    )
  }
}

export default TeacherStudentView