import * as React from 'react';

type GCProps = {
  goal: Goal
  token: string
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
  tasks: Array<Task>
}

type Task = {
  id: number
  description: string
  completed: boolean
  goalId: number
}

class GoalCard extends React.Component<GCProps,GCState>{
  constructor(props: GCProps){
    super(props);
    this.state = {
      tasks: []
    }
  }

  componentDidMount(){
    this.getTasks()
  }

  componentDidUpdate(){
    this.getTasks()
  }

  editGoal = () => {
    //Gonna edit a goal
  }

  getTasks = () => {
    const url: string = `http://localhost:3000/task/teacher_get/${this.props.goal.id}`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.token
          })
      })
      .then((res) => res.json())
      .then((data: Array<Task>) => {
        this.setState({tasks: data})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  renderTasks = () => {
    return(
      <div>
        {this.state.tasks.map((task) => {
          return(
            <div key={`Task${task.id}`}>
              <p style={task.completed?{textDecoration:'line-through'}:undefined}>{task.description}</p>
              <input type='checkbox' defaultChecked={task.completed}/>
            </div>
          )
        })}
      </div>
    )

  }

  render(){
    let goal: Goal = this.props.goal
    return(
      <div style={{border:'1px dashed'}}>
        <h4>GoalCard</h4>
        <p>Id: {goal.id}</p>
        <p>{goal.description}</p>
        <p>Target Date {String(goal.targetDate)}</p>
        <button id='edit-goal' onClick={this.editGoal}>Edit</button>
        {this.state.tasks.length !== 0 ? this.renderTasks() : null}
      </div>
    )
  }
}

export default GoalCard