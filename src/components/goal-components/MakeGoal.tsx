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

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
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

type MGProps = {
  teacherId?: number
  teacherName?: string
  student: Student
  setGParState: Function
  sessionToken: string
  setParState: Function
  getGoals: Function
  getTasks: Function
  toggleMakeGoal: Function
}

type MGState = {
  goalDescription: string
  goalTargetDate: Date | null
  tasks: string
}

type Task = {
  id?: number
  description: string
  completed: boolean
  createdAt?: Date,
  updatedAt?: Date,
  goalId: number,
  studentId: number,
  teacherId?: number
}

class MakeGoal extends React.Component<MGProps,MGState>{
  constructor(props: MGProps){
    super(props);
    this.state = {
      goalDescription: "",
      goalTargetDate: null,
      tasks: "",
    }
  }

  componentDidMount(){
  }

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10) + "T07:00"
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
    // Need to specify a dummy time so the date is not off by one due to time zone issues
    this.setState({goalTargetDate: new Date(e.currentTarget.value + "T07:00:00")})
    
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let date: Date = this.state.goalTargetDate ? this.state.goalTargetDate : new Date()
    e.preventDefault();
    this.props.setParState({makeGoal: false})
    const url: string = (this.props.teacherId) 
    ? `${APIURL}/goal/teacher_create` 
    : `${APIURL}/goal/student_create`
    
    fetch(url, 
      {
        method: 'POST',
        body: JSON.stringify(
          {
            description: this.state.goalDescription,
            targetDate: date, 
            studentId: this.props.student.id,
            teacherId: this.props.teacherId
          }
        ),
        headers: new Headers ({
            'Content-Type': 'application/json',
            'Authorization': this.props.sessionToken
          })
      })
      .then((res) => res.json())
      .then((newGoal: Goal) => {
        
        if(this.state.tasks.length > 0) {this.taskSubmit(newGoal)};
        
        this.props.getGoals();
        
      })
      .catch(err => console.log(`Error posting new goal: ${err}`));
      
  }

  taskSubmit = (newGoal: Goal) => {
    let newTaskList: Array<Task> = this.state.tasks
    .trim()
    .split("\n")   
    .filter((task: string) => task !== "")
    .map((task: string) => {
      let shortTask: Task = {
        description: task,
        completed: false,
        goalId: newGoal.id,
        studentId: this.props.student.id,
        teacherId: this.props.teacherId
      }
      return shortTask
    });

    const url: string = (this.props.teacherId) 
    ? `${APIURL}/task/teacher_bulk` 
    : `${APIURL}/task/student_bulk`
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({taskList: newTaskList}),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.sessionToken
      })
    })
    .then((res) => res.json())
    .then((newTasks: Array<Task>) => {
        this.props.getTasks(); 

    })
    .catch((err) => console.log(`Error posting new tasks ${err}`))
  }

  render(){
    let today: Date = new Date();
    return(
      <div className="absolute top-1/4 left-1/4 bg-white text-black border border-gray-500 p-3 shadow-xl">
        <p className="font-bold text-xl text-blue-500">New Goal</p>
        <form className="flex flex-col" onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
          
          <label className="font-semibold" htmlFor="goal-description">Description</label>
          <textarea
            className="bg-gray-100 px-1"
            required
            onChange=
            {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({goalDescription: e.currentTarget.value})}  id="goal-description"
            name="goal-description"
            cols={30}
            rows={4}>
          </textarea>
          <label className="font-semibold mt-2" htmlFor="target-date">Target Date</label>
          <input
            required
            type='date' 
            id="target-date" 
            name="goal-target-date"
            defaultValue={today.toISOString().slice(0,10)}
            onChange={this.handleDate}
          />
          <label className="font-semibold mt-2" htmlFor="tasks">Tasks one per line (optional)</label>
          <textarea
            className="bg-gray-100 mb-2 px-1"
            onChange=
            {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({tasks: e.currentTarget.value})}  
            id="tasks"
            name="tasks"
            cols={20}
            rows={4}>
          </textarea>
          <div className="flex flex-row justify-start">
            <button 
              className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold hover:opacity-75"
              onClick={() => this.props.toggleMakeGoal()}>
                cancel
              </button>
            <button className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" type="submit" value="Submit">submit</button>
          </div>

        </form>

      </div>
    )
  }
}

export default MakeGoal