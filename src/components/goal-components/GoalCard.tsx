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
  tasks: Array<Task>
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
  // constructor(props: GCProps){
  //   super(props);
  //   this.state = {
  //     tasks: []
  //   }
  // }

  componentDidMount(){
    console.log(`GC MOUNTING`)

  }

  componentDidUpdate(prevProps: GCProps){
    console.log(`GC UPDATED`)
    if(prevProps.goal.id !== this.props.goal.id ){
      console.log(`NEW GOAL HERE: ${this.props.goal.id}`)
    }
  }

  editGoal = () => {
    //Gonna edit a goal
  }

  // getTasks = () => {
  //   const url: string = `http://localhost:3000/task/teacher_get/${this.props.goal.id}`
  //   fetch(url,
  //     {
  //         method: 'GET',
  //         headers: new Headers ({
  //         'Content-Type': 'application/json',
  //         'Authorization': this.props.token
  //         })
  //     })
  //     .then((res) => res.json())
  //     .then((data: Array<Task>) => {
  //       this.setState({tasks: data})
  //     })
  //     .catch(err => {
  //       console.log(`Error in fetch: ${err}`)
  //     }) 
  // }

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
    let goal: Goal = this.props.goal
    console.log(`GC RENDER CURRENT GOAL: ${goal.id}`)
    return(
      <div style={{border:'1px dashed'}}>
        <h4>GoalCard</h4>
        <p>Id: {goal.id}</p>
        <p>{goal.description}</p>
        <p>Target Date {String(goal.targetDate)}</p>
        <button id='edit-goal' onClick={this.editGoal}>Edit</button>
        {this.props.tasks ? this.renderTasks() : null}
      </div>
    )
  }
}

export default GoalCard