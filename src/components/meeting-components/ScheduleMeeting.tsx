import * as React from 'react';
import APIURL from '../../helpers/environment'

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

type Teacher = {
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

type SMUser = {
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
  date: string
  time: string
}

class ScheduleMeeting extends React.Component<SMProps,SMState>{
  constructor(props: SMProps){
    super(props);
    this.state = {
      date: "",
      time: "02:00:00",
      d_t: new Date(),
      teacher: {
        id: 0,
        displayName: "",
        email: "",
        availability: 
          {
            mon : [],
            tue : [],
            wed : [],
            thu : [],
            fri : []
          },
        partners: []
      },
      student: {
        id: 0,
        displayName: "",
        email: "",
        availability: 
          {
            mon : ["14:00:00", "14:15:00", "14:30:00"],
            tue : ["13:15:00", "13:30:00", "13:45:00", "14:00:00", "14:15:00", "14:30:00"],
            wed : ["14:00:00", "14:15:00", "14:30:00"],
            thu : ["13:15:00", "13:30:00", "13:45:00", "14:00:00", "14:15:00", "14:30:00"],
            fri : ["14:00:00", "14:15:00", "14:30:00"]
          },
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
    this.setState({date: selectedDate})
    
    let selectedDT = selectedDate + "T" + this.state.time;
    this.setState({d_t: new Date(selectedDT)})
    
    
  }

  handleTime = (timeSlot: string) => {
    this.setState({time: timeSlot})
    if(this.state.date !== ""){
      let selectedDT = this.state.date + "T" + timeSlot;
      this.setState({d_t: new Date(selectedDT)})
    }
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

    if(this.state.time === "02:00:00"){
      window.alert("Please select a time.")
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
    let id: number = Number(idString);
    let selectedStudent: Student | undefined = this.props.allStudents?.find(student => student.id === id);
    if (selectedStudent) {
      this.setState({student: selectedStudent});
      console.log("MEETINGS: ", selectedStudent)
    }
  }

  renderTimeSelections = () => {
    let dow: any = this.state.d_t.getDay();
    // let role: string = this.props.teacher ? 'teacher' : 'student';
    let user: SMUser; 
    if(this.props.teacher){
      user = this.props.teacher;
    }else if (this.props.student){
      user = this.props.student;
    }else{
      user = this.state.teacher
    }

    let rawSlots: string[];

    switch(dow) {
      case 1:
        rawSlots= user.availability.mon;
        break;
      case 2:
        rawSlots= user.availability.tue;
        break;
      case 3:
        rawSlots= user.availability.wed;
        break;
      case 4:
        rawSlots= user.availability.thu;
        break;
      case 5:
        rawSlots= user.availability.fri;
        break;
      default:
        rawSlots= [];
    }
    
    return(
      <div className="row-span-2 mx-5">
        <p className = "font-semibold"> Time </p>
        <div className="flex flex-col gap-4">
          {rawSlots.map((slot: string) => {
            let available = this.checkSlotAvailability(slot)
            let selected: boolean = this.formatSlotTime(this.state.time) === this.formatSlotTime(slot);
            return(
              <p 
                className={`text-white font-semibold py-1 w-20 text-center rounded-md
                  ${available ? `bg-blue-600 hover:bg-blue-800 ${selected ? "bg-blue-800" : null}`
                            : "bg-gray-500"}
                `}
                onClick={available ? () => this.handleTime(slot) : undefined}
              >
                {this.formatSlotTime(slot)}
              </p> 
            )
          })}
        </div>
      </div>
    )
  }

  formatSlotTime = (rawTime: string) => {
    let rawHour: string = rawTime.slice(0,2);
    let rawMinute: string = rawTime.slice(3,5);
    let rawHourNum: number = Number(rawHour);
    let formatHourNum: number = rawHourNum > 12 ? rawHourNum - 12 : rawHourNum;
    let AP: string = rawHourNum < 12 ? "am" : "pm";
    let formatTime = `${String(formatHourNum)}:${rawMinute} ${AP}`
    return formatTime

  }

  checkSlotAvailability = (timeSlot: string) => {
    let meetings: Array<Meeting> | undefined = 
      this.props.teacher ? this.props.teacher.meetings 
                          : this.props.student ? this.props.student.meetings : []
    let meetingDTs: Date[] | undefined = meetings?.map(meeting => meeting.d_t)
    meetingDTs?.forEach(meetingDT => {
      let mDT: Date = new Date(meetingDT);
      let selectedDate: string = this.state.d_t.toISOString().slice(0,10);
      let meetingDate: string = mDT.toISOString().slice(0,10);
      let meetingTime: string = mDT.toISOString().slice(11,20);
      if(meetingDate === selectedDate && meetingTime === timeSlot){
        return false
      }
    })
    return true
  }

  render(){
    console.log(this.state.d_t)
    return(
      <div className = "absolute top-1/4 left-1/4 bg-white text-black border border-gray-500 p-3 shadow-xl"> 
        <p 
          className="text-center font-bold text-3xl text-blue-600 mb-4" 
        >
          Schedule meeting
        </p>
        <form 
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}
          className="flex flex-col gap-4"
        > 
          <div className="grid grid-cols-2 grid-rows-2 grid-flow-col gap-6">
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
            {this.renderTimeSelections()}
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