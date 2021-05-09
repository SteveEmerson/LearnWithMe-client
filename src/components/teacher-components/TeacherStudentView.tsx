import * as React from 'react';
import StudentCardFull from '../student-components/StudentCardFull';
import StudentCardSmall from '../student-components/StudentCardSmall';

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
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
    availability: {
    mon: string[],
    tue: string[],
    wed: string[],
    thu: string[],
    fri: string[]
  }
  partners: number[]
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
  students: Array<Student>
  getMeetings: Function
  getGoals: Function
  getTasks: Function
}

type TSVState = {
  currStudent: Student
  mounted: boolean
}

// CHANGED THIS DURING SMV CODING >>> WILL IT BREAK?
// type FetchStudentData = {
//   id: number,
//   email: string,
//   passwordhash: string,
//   name: string,
//   teacherList: number[] | null
//   role: string,
//   availability: {},
//   createdAt: string,
//   updatedAt: string
// }


class TeacherStudentView extends React.Component<TSVProps,TSVState>{
  constructor(props: TSVProps){
    super(props)
    this.state = {
      currStudent: this.props.students[0],
      mounted: false,
    }

    this.setState = this.setState.bind(this)
  }

  componentDidMount(){
    
  }

  componentDidUpdate(prevProps: TSVProps, prevState: TSVState){
      if(prevState.currStudent && this.state.currStudent && (prevState.currStudent.id !== this.state.currStudent.id)){

        this.props.getMeetings();
  
        this.props.getGoals();
      
        this.props.getTasks();
      
      }
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
      this.props.students.map((student: Student) => {
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
      <div className="px-10 pt-20"> 
        <p className="font-bold text-5xl text-blue-500 mb-5 ml-4" style={{color:"blue"}}>{this.props.user.displayName}</p>
        {/* Contents ... SCF left  SCS grid right*/}
        <div className="grid grid-cols-3 gap-6" >
          <div className="col-span-1">
            {this.state.currStudent && this.state.currStudent.id !== 0
            ? <StudentCardFull 
                student={this.state.currStudent}
                setTSVState={this.setState}
                token={this.props.user.sessionToken}
                teacher={this.props.user}
                getMeetings={this.props.getMeetings}
                getGoals={this.props.getGoals}
                getTasks={this.props.getTasks}
                meetings={this.props.meetings}
              />
            : null}
          </div>
          <div className="col-span-2 grid grid-cols-3 content-start gap-3">
            {this.props.students.length !== 0 ? this.renderStudentList() : null}
          </div>
        </div>
      </div>
      
    )
  }
}

export default TeacherStudentView