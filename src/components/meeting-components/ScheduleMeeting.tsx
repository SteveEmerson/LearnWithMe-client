import * as React from 'react';
import APIURL from '../../helpers/environment'

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  partners: number[]
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
}

type Teacher = {
  id: number
  displayName: string
  email: string
  availability: {}
  partners: number[]
  meetings?:Array<Meeting>
  goal?:Goal
  tasks?: Array<Task>
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

// type User = {
//   email: string
//   userId: number
//   displayName: string
//   partnerList: number[]
//   role: string
//   availability: {}
//   sessionToken: string
// }

type Goal = {
  id: number
  description: string
  targetDate: Date
  createdAt: Date
  updatedAt: Date
  studentId: number
  teacherId: number | null
}

type Meeting= {
  id: number
  d_t: Date
  teacherId: number
  studentId: number
  createdAt: Date
  updatedAt: Date
}

type SMProps = {
  teacher: Teacher | null
  student: Student | null
  setGParState: Function
  token: string
  allTeachers: Array<Teacher> | null
  allStudents: Array<Student> | null
  getStudentMeetings?: Function
  getTeacherMeetings?: Function
  toggleScheduleMeeting:Function
  mountingFrom: string
}

type SMState = {
  d_t: Date
  teacher: Teacher
  student: Student
}

class ScheduleMeeting extends React.Component<SMProps,SMState>{
  constructor(props: SMProps){
    super(props);
    this.state = {
      d_t: new Date(),
      teacher: {
        id: 0,
        displayName: "",
        email: "",
        availability: 
          {
            mo: [],
            tu: [],
            we: [],
            th: [],
            fr: []
          },
        partners: []
      },
      student: {
        id: 0,
        displayName: "",
        email: "",
        availability: {},
        partners: []
      }
    }
  }

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10)
  }

  getMaxDate = (): Date => {
    let today: Date = new Date();
    let cYear: number = today.getFullYear()
    let cMonth: number = today.getMonth();
    let maxMonth: number = 5;
    let maxYear: number = cYear;
    if (cMonth > maxMonth){
      maxYear = cYear + 1
    }
    let maxDay: number = this.getLastDayOfMonth(maxMonth, maxYear);
    return new Date(maxYear, maxMonth, maxDay)
  }

  getLastDayOfMonth = (m: number, y: number): number => {
    let date: Date = new Date(y, m + 1, 0);
    let day: number = date.getDate();
    return day
  }

  handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    let selectedDate = e.currentTarget.value;
    let selectedTime = "T07:15:00"
    let selectedDT = selectedDate + selectedTime
    //console.log(new Date(selectedDT))
    this.setState({d_t: new Date(selectedDT)})
  }

  submitValidation = (): boolean => {
    let role: string = this.props.teacher ? 'teacher' : 'student'
    if(this.state.student.id === 0){
      window.alert(`You must select a ${role==="teacher" ? "student." : " teacher."}`)
      return false
    }

    let dow: number = this.state.d_t.getDay()
    if(dow === 0 || dow === 6){
      window.alert("Meetings can only be scheudled for school days.")
      return false
    }

    return true
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let role = this.props.teacher ? 'teacher' : 'student'
    if(this.submitValidation()){        
      const url: string = `${APIURL}/meeting/${role}_create`
      fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(
              {
                d_t: this.state.d_t, 
                teacherId: this.props.teacher ? this.props.teacher.id: this.state.teacher.id,
                studentId: this.props.student ? this.props.student.id: this.state.student.id
              }
            ),
            headers: new Headers ({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
            })
        })
        .then((res) => res.json())
        .then((data: Meeting) => {
  
          if(role === "teacher" && this.props.getTeacherMeetings){
            this.props.getTeacherMeetings()
          }
  
          if(role === "student" && this.props.getStudentMeetings){
            this.props.getStudentMeetings()
          }
  
          this.props.toggleScheduleMeeting()
        })
        .catch(err => {
          console.log(`Error in fetch: ${err}`)
        }) 
    }
  }

  componentDidUpdate(){
    
  }

  renderTeacherSelect = () => {
    return(
      <div>
        <label className="font-semibold mr-2" htmlFor="students">Student</label>
        <select 
          name="teachers" 
          id='teacher-select'
          onChange={(e) => this.handleTeacherSelect(e.currentTarget.value)}
        >
          <option defaultValue="Select">--make a selection--</option>
          {this.props.allTeachers?.map((teacher: Teacher) => {
            return(
              <option 
                value={teacher.id}
                key={`TOP${teacher.id}`}
                disabled = {this.props.student 
                  ? !teacher.partners.includes(this.props.student.id)
                  : undefined}
                >
                  {teacher.displayName}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  renderStudentSelect = () => {
    return(
      <div>
        <label className="font-semibold mr-2" htmlFor="students">Student</label>
        <select
          name="students" 
          id='student-select'
          onChange={(e) => this.handleStudentSelect(e.currentTarget.value)}
        >
          <option defaultValue="Select">--make a selection--</option>
          {this.props.allStudents?.map((student: Student) => {
            return(
              <option 
                value={student.id}
                key={`SOP${student.id}`}
                disabled = {this.props.teacher
                  ? !student.partners.includes(this.props.teacher.id)
                  : undefined}
              >
                {student.displayName}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  handleTeacherSelect = (idString: string) => {
    let id: number = Number(idString)
    let selectedTeacher: Teacher | undefined = this.props.allTeachers?.find(teacher => teacher.id === id)
    if (selectedTeacher) {
      this.setState({teacher: selectedTeacher});
    }
  }

  handleStudentSelect = (idString: string) => {
    let id: number = Number(idString)
    let selectedStudent: Student | undefined = this.props.allStudents?.find(student => student.id === id)
    if (selectedStudent) {
      this.setState({student: selectedStudent});
      console.log("MEETINGS: ", selectedStudent)
    }
  }

  render(){
    console.log(this.props.teacher)
    return(
      <div className = "absolute top-1/4 left-1/4 bg-white text-black border border-gray-500 p-3 shadow-xl"> 
        <p className="text-center font-bold text-xl text-blue-500 mb-4" style={{color:"blue"}}>Schedule Meeting</p>
        <form 
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          className="grid grid-rows-2 grid-cols-1 gap-4"
        > 
          <div className="grid grid-cols-2 grid-rows-2 grid-flow-col gap-4">
            {this.props.teacher && this.props.student
              ? <p className="font-semibold mt-2">Meet with {this.props.student.displayName}</p>
              : this.props.student ? this.renderTeacherSelect() : this.renderStudentSelect()
            }
            <div>
              <label className="font-semibold mt-2" htmlFor="meeting-date">Date </label>
              <input 
                className=" mt-2 mb-2" 
                onChange={this.handleDate} 
                type="date"
                id="meeting-date"
                name="meeting-date" 
                defaultValue={this.getDateString(new Date())}
                min={this.getDateString(new Date())} 
                max={this.getDateString(this.getMaxDate())}
              >
              </input>
            </div>
            <div className="col-span-2">
              <p>
                Gonna be picking a time
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-start mt-2">
            <button 
              className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold hover:opacity-75"
              onClick={() => this.props.toggleScheduleMeeting()}>
                cancel
              </button>
            <button className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" type="submit" value="Submit">submit</button>
          </div>
          {/* <input type='submit' value='Submit'/> */}
        </form>
      </div>
    )
  }
}

export default ScheduleMeeting