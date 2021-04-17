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

type Goal = {
  id: number
  description: string
  targetDate: Date
  createdAt: Date
  updatedAt: Date
  studentId: number
  teacherId: number | null
}

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  meetings?:Array<Meeting>
  goal?:Goal
}

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
}

type TSVProps = {
  user: User
  meetings: Array<Meeting>
  goals: Array<Goal>
  getMeetings: Function
  getGoals: Function
}

type TSVState = {
  currStudent: Student
  allTeacherStudents: Array<Student>
  mounted: boolean
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
      currStudent: {
        id: 0,
        displayName: "",
        email: "",
        availability: {},
        meetings:[],
        goal: {
          id: 0,
          description: "",
          targetDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          studentId: 0,
          teacherId: 0
        }
      },
      allTeacherStudents: [],
      mounted: false,
    }

    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    this.getStudentList();
    
  }

  componentDidUpdate(prevProps: TSVProps, prevState: TSVState){
    // FIX THIS ... SEEMS LIKE THIS IS TRIGGERIENG WHEN THE GOAL IS UPDATED
    if (this.state.currStudent && prevState.currStudent.meetings !== this.state.currStudent.meetings){
      console.log(this.state.currStudent)
      this.props.getMeetings();
    }
    
    if (this.state.currStudent && prevState.currStudent.goal !== this.state.currStudent.goal){
      console.log(this.state.currStudent)
      this.props.getGoals();
    }
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
          return {id: partner.id, displayName: partner.name, email:partner.email, availability:partner.availability}
        } )
        this.setState({allTeacherStudents: allStudents})
        console.log(this.state.allTeacherStudents)
        if(!this.state.mounted){
          let cStud = allStudents[0]; 
          cStud.meetings = this.getStudentMeetings(cStud.id)
          cStud.goal = this.getStudentGoal(cStud.id)
          this.setState({currStudent: cStud})
          this.setState({mounted: true})
        }
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  getStudentMeetings = (id: number) => {
    let studentMeetings: Array<Meeting> = 
      this.props.meetings.filter((meeting: Meeting) => meeting.studentId === id)
    return studentMeetings
  }

  getStudentGoal = (id: number) => {
    let studentGoal: Goal = 
      this.props.goals.filter((goal: Goal) => goal.studentId === id)[0]
    return studentGoal
  }

  renderStudentList = () => {
    return(
      this.state.allTeacherStudents.map((student: Student) => {
        let studentMeetings = this.getStudentMeetings(student.id)
        student.meetings = studentMeetings
        student.goal = this.getStudentGoal(student.id)
        return(
          <StudentCardSmall
            student={student} 
            setTSVState = {this.setState}  
            token={this.props.user.sessionToken}
            key={`SCS${student.id}`}
          />

        )
      })
    )
  }

  render() {
    return(
      <div> 
        <h3>Teacher Student View</h3>
        <div className="StudentCardFull">
          {this.state.currStudent.id !== 0
          ? <StudentCardFull 
              student={this.state.currStudent}
              setTSVState={this.setState}
              token={this.props.user.sessionToken}
              teacher={this.props.user}
            />
          : null}
          <br />
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