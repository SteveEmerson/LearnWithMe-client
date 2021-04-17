import * as React from 'react';

type GCProps = {
  student: Student
  goal: Goal
  token: string
  tasks?: Array<Task>
  setTSVState: Function
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

type Goal = {
  id: number
  description: string
  targetDate: Date
  createdAt: Date
  updatedAt: Date
  studentId: number
  teacherId: number | null
}

type GCState = {
  updatedTasks?: Array<Task>
  showEditForm: boolean
  showConfirmButton: boolean
  newGoalDesc: string
  newDate: Date
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

class GoalCard extends React.Component<GCProps,GCState>{
  constructor(props: GCProps){
    super(props);
    this.state = {
      updatedTasks: this.props.tasks,
      newGoalDesc: this.props.goal.description,
      newDate: this.props.goal.targetDate,
      showEditForm: false,
      showConfirmButton: false
    }
  }

  componentDidMount(){
    console.log(`GC MOUNTING`)
  }


  componentDidUpdate(prevProps: GCProps){
    console.log(`GC UPDATED`)
    if(prevProps.goal.id !== this.props.goal.id ){
      console.log(`NEW GOAL HERE: ${this.props.goal.id}`)
    }
  }

  handleEditGoal = () => {
    //Gonna edit a goal
  }

  handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({newDate: new Date(e.currentTarget.value)})
  }

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10) + "T07:00"
  }

  toggleEditForm = () => {
    this.setState({showEditForm: !this.state.showEditForm})
  }

  cancelEdit = () => {
    this.toggleEditForm();
    this.setState({newGoalDesc: this.props.goal.description})
    this.setState({newDate: this.props.goal.targetDate})
  }

  updateGoal = () => {
    this.toggleEditForm()
    const url = `http://localhost:3000/goal/teacher_update/${this.props.goal.id}`
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({
        description: this.state.newGoalDesc,
        targetDate: this.state.newDate
      }),
      headers: new Headers ({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json: {data: number[]}) => {
      console.log(json.data[0])
      let newGoal: Goal = this.props.goal;
      newGoal.description = this.state.newGoalDesc;
      newGoal.targetDate = this.state.newDate;

      let cStud: Student = {
        id: this.props.student.id,
        displayName: this.props.student.displayName,
        email: this.props.student.email,
        availability: this.props.student.availability,
        meetings: this.props.student.meetings,
        goal: newGoal,
        tasks: this.props.student.tasks
      }

      this.props.setTSVState({currStudent: cStud});
    })
    .catch(err => console.log(`Error in updating goal ${err}`))
  }

  renderTasks = () => {
    console.log(`I AM RENDERING TASKS`)
    return(
      <div>
        {(this.props.tasks) 
          ? this.props.tasks.map((task) => {
            return(
              <div key={`Task${task.id}`}>
                <p style={task.completed?{textDecoration:'line-through'}:undefined}>{task.description}</p>
                <input type='checkbox' defaultChecked={task.completed}/>
              </div>
            )
          })
          : null
        }
      </div>
    )
  }

  render(){
    console.log(this.state.newDate)
    let goal: Goal = this.props.goal
    console.log(`GC RENDER CURRENT GOAL: ${goal.id}`)
    return(
      <div style={{border:'1px dashed'}}>
        <h4>GoalCard</h4>
        <div hidden={this.state.showEditForm} id="goal-info" onClick={this.toggleEditForm}>
          <p>Id: {goal.id}</p>
          <p>{goal.description}</p>
          <p>Target Date {String(goal.targetDate).slice(0,10)}</p>
          <p>click goal to edit</p>
        </div>
        <div hidden={!this.state.showEditForm} id="change-goal-info">
          <p>Id: {goal.id}</p>
          <input  
            type='date' 
            id="target-date" 
            name="goal-target-date"
            value={String(goal.targetDate)}
            onChange={this.handleDate}
          />
          <textarea
            onChange=
            {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({newGoalDesc: e.currentTarget.value})}  id="goal-description"
            name="goal-description"
            cols={20}
            rows={3}
            defaultValue={goal.description}
          />
          <p onClick={this.updateGoal}>confirm changes</p>
          <p onClick={this.cancelEdit}>cancel</p>
        </div>
        <hr/>
        <h5>Tasks</h5>
        {this.props.tasks ? this.renderTasks() : null}
        {this.state.showConfirmButton 
          ? <button onClick={this.handleEditGoal}>Confirm Changes</button>
          : null}

      </div>
    )
  }
}

export default GoalCard