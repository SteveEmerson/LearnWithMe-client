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
  tasks?: Array<Task>
}

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
}

type Task = {
  id: number
  description: string
  completed: boolean
  createdAt: Date,
  updatedAt: Date,
  goalId: number,
  studentId: number,
  teacherId: number
}

type TSVProps = {
  user: User
  meetings: Array<Meeting>
  goals: Array<Goal>
  tasks: Array<Task>
  getMeetings: Function
  getGoals: Function
  getTasks: Function
}

type TSVState = {
  currStudent: Student
  allTeacherStudents: Array<Student>
  mounted: boolean
}

// CHANGED THIS DURING SMV CODING >>> WILL IT BREAK?
type FetchStudentData = {
  id: number,
  email: string,
  passwordhash: string,
  name: string,
  teacherList: number[] | null
  role: string,
  availability: {},
  createdAt: string,
  updatedAt: string
}

type AllPartners = Array<FetchStudentData>

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
        },
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
      console.log("GOT TO UPDATE TSV")
      if(prevState.currStudent.id !== this.state.currStudent.id){
        // console.log(`TSV UPDATE CURR STUDENT`)

        this.props.getMeetings();
  
        this.props.getGoals();
      
        this.props.getTasks();
      
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
        data.filter((partner:FetchStudentData) => {
          return this.props.user.partnerList.includes(partner.id)
        })
        .map((partner: FetchStudentData) => {
          return {id: partner.id, displayName: partner.name, email:partner.email, availability:partner.availability}
        } )
        this.setState({allTeacherStudents: allStudents})
        console.log(this.state.allTeacherStudents)

        // FIX? IS THIS NEEDED TO SET THE CURRENT STUDENT OR CAN THE SCS DO THAT BY DEFAULT CLICKING ON A STUDENT
        if(!this.state.mounted){
          let cStud = allStudents[0]; 
          cStud.meetings = this.getStudentMeetings(cStud.id)
          cStud.goal = this.getStudentGoal(cStud.id)
          cStud.tasks = this.getStudentTasks(cStud.id)
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

  getStudentTasks = (id: number) => {
    let studentTasks: Array<Task> = 
      this.props.tasks.filter((task: Task) => task.studentId === id)
    return studentTasks
  }

  renderStudentList = () => {
    return(
      this.state.allTeacherStudents.map((student: Student) => {
        student.meetings = this.getStudentMeetings(student.id)
        student.goal = this.getStudentGoal(student.id)
        student.tasks = this.getStudentTasks(student.id)

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
              getMeetings={this.props.getMeetings}
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