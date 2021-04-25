import * as React from 'react';

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
  goalTargetDate: Date
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
      goalTargetDate: new Date(),
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
    this.setState({goalTargetDate: new Date(e.currentTarget.value)})
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.setParState({makeGoal: false})
    const url: string = (this.props.teacherId) 
    ? `http://localhost:3000/goal/teacher_create` 
    : `http://localhost:3000/goal/student_create`
    
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
        
        if(this.state.tasks.length > 0) {this.taskSubmit(newGoal)};

        if(!this.props.teacherId){
          this.props.getGoals();
        }else if(this.props.teacherId){
          // let cStud: Student = {
          //   id: this.props.student.id,
          //   displayName: this.props.student.displayName,
          //   email: this.props.student.email,
          //   availability: this.props.student.availability,
          //   meetings: this.props.student.meetings,
          //   goal: newGoal,
          // }
          // this.props.setGParState({currStudent: cStud});
          this.props.getGoals()
        }

        //this.props.toggleMakeGoal()


      })
      .catch(err => console.log(`Error posting new goal: ${err}`));
      
  }

  //FIX THIS ... WILL BE A PROBLEM IF GOAL HAS NO TASKS?

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

    console.log(JSON.stringify({taskList: newTaskList}))

    const url: string = (this.props.teacherId) 
    ? `http://localhost:3000/task/teacher_bulk` 
    : `http://localhost:3000/task/student_bulk`
    
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
      if(this.props.teacherId){
        // let cStud: Student = {
        //   id: this.props.student.id,
        //   displayName: this.props.student.displayName,
        //   email: this.props.student.email,
        //   availability: this.props.student.availability,
        //   meetings: this.props.student.meetings,
        //   goal: newGoal,
        //   tasks: newTasks
        // }
  
        // this.props.setGParState({currStudent: cStud});
        //this.props.getTasks()
      }

        
        this.props.getTasks();
      

    })
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
            name="goal-description"
            cols={30}
            rows={8}>
          </textarea>
          <label htmlFor="target-date">Target Date</label>
          <input 
            type='date' 
            id="target-date" 
            name="goal-target-date"
            value={this.state.goalTargetDate.toISOString().slice(0,10)}
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