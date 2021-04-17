import * as React from 'react';

type GCProps = {
  goal: Goal
  token: string
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
        <div id="goal-info" onClick={this.toggleEditForm}>
          <p>Id: {goal.id}</p>
          <p>{goal.description}</p>
          <p>Target Date {String(goal.targetDate)}</p>
          <p>click goal to edit</p>
        </div>
        <div id="change-goal-info">
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