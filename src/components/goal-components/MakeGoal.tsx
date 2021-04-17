import * as React from 'react';

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  meetings?:Array<Meeting>
  goal?:Goal
}

type User = {
  email: string
  userId: number
  displayName: string
  partnerList: number[]
  role: string
  availability: {}
  sessionToken: string
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
  teacherId: number
  teacherName: string
  student: Student
  setTSVState: Function
  sessionToken: string
  setSCFState: Function
}

type MGState = {
  goalDescription: string
  goalTargetDate: Date
  tasks: string
}

type Task = {
  id: number
  description: string
  completed: boolean
  goalId: number
}

class MakeGoal extends React.Component<MGProps,MGState>{
  constructor(props: MGProps){
    super(props);
    this.state = {
      goalDescription: "",
      goalTargetDate: new Date(),
      tasks: ""
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
    this.setState({goalTargetDate: new Date(e.currentTarget.value)})
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.setSCFState({makeGoal: false})
    const url: string = `http://localhost:3000/goal/teacher_create`;
    fetch(url, 
      {
        method: 'POST',
        body: JSON.stringify(
          {
            description: this.state.goalDescription,
            targetDate: this.state.goalTargetDate, 
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
        let cStud: Student = {
          id: this.props.student.id,
          displayName: this.props.student.displayName,
          email: this.props.student.email,
          availability: this.props.student.availability,
          meetings: this.props.student.meetings,
          goal: newGoal
        }
        // Does this need to be asynchronous?
        this.taskSubmit(newGoal.id);
        this.props.setTSVState({currStudent: cStud});
      })
      .catch(err => console.log(`Error posting new goal: ${err}`));
      
  }

  taskSubmit = (goalId: number) => {
    let newTaskList = this.state.tasks
    .split("\n")
    .filter((task) => task !== "")
    .map((task) => {
      let fullTask = {
        description: task,
        completed: false,
        goalId: goalId,
        studentId: this.props.student.id,
        teacherId: this.props.teacherId
      }
      return fullTask
    });

    console.log(JSON.stringify({taskList: newTaskList}))

    const url = `http://localhost:3000/task/teacher_bulk`;
    
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({taskList: newTaskList}),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.sessionToken
      })
    })
    .then((res) => res.json())
    .then((newTasks: Array<Task>) => console.log(newTasks))
    .catch((err) => console.log(`Error posting new tasks ${err}`))
  }

  render(){
    return(
      <div>
        <h4>MakeGoal</h4>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
          <label htmlFor="goal-description">Description</label>
          <textarea
            onChange=
            {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({goalDescription: e.currentTarget.value})}  id="goal-description"
            name="meeting-time"
            cols={30}
            rows={8}>
          </textarea>
          <label htmlFor="target-date">Target Date</label>
          <input 
            type='date' 
            id="target-date" 
            name="goal-target-date"
            value={this.getDateString(new Date())}
            onChange={this.handleDate}
          />
          <label htmlFor="tasks">Enter tasks for this goal, one per line (optional)</label>
          <textarea
            onChange=
            {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({tasks: e.currentTarget.value})}  
            id="tasks"
            name="tasks"
            cols={30}
            rows={8}>
          </textarea>
          <input type="submit" value="Submit"/>
        </form>

      </div>
    )
  }
}

export default MakeGoal