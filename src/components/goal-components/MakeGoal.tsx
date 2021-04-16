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
  studentId: number
  studentName: string
  setTSVState: Function
}

type MGState = {
  goalDescription: string
  goalTargetDate: Date
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
      goalTargetDate: new Date()
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
        </form>

      </div>
    )
  }
}

export default MakeGoal