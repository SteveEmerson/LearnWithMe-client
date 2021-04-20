import * as React from 'react';

type GCProps = {
  rolePOV: string
  student: Student
  goal: Goal
  token: string
  tasks?: Array<Task>
  setGParState?: Function
  getStudentGoals?: Function
}

type Student = {
  id: number
  displayName: string
  email: string
  availability: {}
  meetings?:Array<Meeting>
  goal?:Goal | null
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
  newGoalDesc: string
  newDate: Date
  newTasks: Array<Task>
  tasksChanged: boolean
}

type Task = {
  id?: number
  description: string
  completed: boolean
  createdAt?: Date,
  updatedAt?: Date,
  goalId: number,
  studentId: number,
  teacherId?: number | null
}



class GoalCard extends React.Component<GCProps,GCState>{
  constructor(props: GCProps){
    super(props);
    this.state = {
      updatedTasks: [],
      newGoalDesc: this.props.goal.description,
      newDate: this.props.goal.targetDate,
      newTasks: [],
      showEditForm: false,
      tasksChanged: false
    }
  }

  componentDidMount(){
    // Setting the state to a props that is an doesnt work ... creates a reference
    this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
   
  }


  componentDidUpdate(prevProps: GCProps, prevState: GCState){
    
    if(prevProps.goal.id !== this.props.goal.id ){
      console.log("Got here")
      this.setState({updatedTasks: this.props.tasks})
      this.setState({tasksChanged: false})
    }

    if(prevProps.tasks !== this.props.tasks){
      this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
      this.setState({tasksChanged: false})
    }
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
    this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
  }

  handleTaskChange = (id: number | undefined) => {
    
    let tempTasks: Array<Task> = this.state.updatedTasks ? this.state.updatedTasks : [];
    let currentTaskIndex: number = tempTasks.findIndex(task => task.id === id);
    let currentTask :Task = tempTasks[currentTaskIndex];
    currentTask.completed = !currentTask.completed;
    tempTasks[currentTaskIndex] = currentTask;
    this.setState({updatedTasks: tempTasks})
    this.checkTasksSame()
    console.log(`${this.props.tasks ? this.props.tasks[0].completed : undefined}`)
    this.checkTasksSame()
  }


  checkTasksSame = () => {
    let uT: Array<Task> = this.state.updatedTasks ? this.state.updatedTasks : [];
    let pT: Array<Task> = this.props.tasks ? this.props.tasks : [];
    //console.log(uT)
    //console.log(pT)
    this.setState({tasksChanged: uT?.length !== pT?.length || !this.compareArrays(uT, pT)}) 
  }

  compareArrays = (a: Array<Task>, b: Array<Task>) => {
    for(let i: number = 0; i < a.length; i++){
      if(a[i].description !== b[i].description || a[i].completed !== b[i].completed){
        return false
      }
    }
    return true
  }

  updateTasks = () => {
    let changedTasks: Array<Task> | undefined = 
      this.state.updatedTasks?.filter((task: Task) => !this.props.tasks?.includes(task));

    if (changedTasks && changedTasks.length > 0) {
      changedTasks.forEach((task: Task) => {
        const url = `http://localhost:3000/task/${this.props.rolePOV}_update/${task.id}`
   
        fetch(url, {
          method: 'PUT',
          body: JSON.stringify({
            description: task.description,
            completed: task.completed
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
          })
        })
        .then(res => res.json())
        .then((json: {data: number[]}) => {
          console.log(json.data[0])

          if(this.props.rolePOV === "teacher" && this.props.setGParState){
            let cStud: Student = {
              id: this.props.student.id,
              displayName: this.props.student.displayName,
              email: this.props.student.email,
              availability: this.props.student.availability,
              meetings: this.props.student.meetings,
              goal: this.props.goal,
              tasks: this.state.updatedTasks
            }
            this.props.setGParState({currStudent: cStud});
          }

          if(this.props.rolePOV === "student" && this.props.setGParState){
            this.props.setGParState({tasks: this.state.updatedTasks});
          }

        })
        .catch(err => console.log(`Error in updating tasks ${err}`))
      });
    }
    
  }

  updateGoal = () => {
    this.toggleEditForm()
    const url = `http://localhost:3000/goal/${this.props.rolePOV}_update/${this.props.goal.id}`

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

      if(this.props.rolePOV === "teacher" && this.props.setGParState) {
        let cStud: Student = {
          id: this.props.student.id,
          displayName: this.props.student.displayName,
          email: this.props.student.email,
          availability: this.props.student.availability,
          meetings: this.props.student.meetings,
          goal: newGoal,
          tasks: this.props.student.tasks
        }
        this.props.setGParState({currStudent: cStud});
      }

      if(this.props.rolePOV === "student" && this.props.getStudentGoals){
        this.props.getStudentGoals();
      }

    })
    .catch(err => console.log(`Error in updating goal ${err}`))
  }

  renderTasks = () => {
    return(
      <div>
        {(this.state.updatedTasks) 
          ? this.state.updatedTasks.map((task) => {
            return(
              <div key={`T${task.id}`}>
                <p 
                  style={task.completed?{textDecoration:'line-through'}:undefined}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {this.handleTaskChange(task.id)}}
                >
                  {task.description}
                </p>
              </div>
            )
          })
          : null
        }
      </div>
    )
  }

  deleteGoal = () => {

    const url=`http://localhost:3000/goal/${this.props.rolePOV}_delete/${this.props.goal.id}`
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      this.deleteAllTasks()

      if(this.props.rolePOV === "teacher" && this.props.setGParState) {
        let cStud: Student = {
          id: this.props.student.id,
          displayName: this.props.student.displayName,
          email: this.props.student.email,
          availability: this.props.student.availability,
          meetings: this.props.student.meetings,
          goal: null,
          tasks: this.props.student.tasks
        }
        this.props.setGParState({currStudent: cStud});
      }

      if(this.props.rolePOV === "student" && this.props.getStudentGoals){
        this.props.getStudentGoals();
      }
    })
    .catch(err => console.log(`Error deleting goal: ${err}`));
  }

  deleteAllTasks = () => {
    console.log(this.props.rolePOV)
    if(this.props.tasks && this.props.tasks.length > 0){
      this.props.tasks.forEach((task: Task) => {
        const url=`http://localhost:3000/task/${this.props.rolePOV}_delete/${task.id}`
        fetch(url, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
          })
        })
        .then(res => res.json())
        .then((json) => {
          console.log(json)
          this.setState({updatedTasks: []})

          // if(this.props.rolePOV === "student" && this.props.setGParState){
          //   this.props.setGParState({tasks: this.state.updatedTasks});
          // }
        })
        .catch(err => console.log(`Error deleting task: ${err}`));
      });
    }
  }

  renderEditTasks = () => {
    return(
      this.state.updatedTasks?.map((task) => {
        return(
          <div key={`ET${task.id}`}>
            <p>{task.description}</p>
            <button onClick={() => this.removeTask(task.id)}>X</button>
          </div>
        )
      })
    )
  }

  removeTask = (taskId: number | undefined) => {
    this.setState({updatedTasks: this.state.updatedTasks?.filter(task => task.id !== taskId)})
  }

  addTask(e: React.FormEvent<HTMLInputElement>){
    e.preventDefault();
    let nt: Task = {
      description: e.currentTarget.value, 
      completed: false, 
      goalId: this.props.goal.id,
      studentId: this.props.student.id,
      teacherId:  this.props.goal.teacherId 
    }

    let temp: Array<Task> = this.state.newTasks
    temp.push(nt)
    this.setState({newTasks: temp})
  }

  render(){
    let goal: Goal = this.props.goal
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
          <div>
            {this.renderEditTasks()}
            <input type="text"/>
            <button onClick={(e:React.FormEvent<HTMLInputElement>) => {this.addTask(e)}}>add</button>
          </div>
          
          <p onClick={this.updateGoal}>confirm changes</p>
          <p onClick={this.cancelEdit}>cancel</p>
        </div>
        <hr/>
        <h5>Tasks</h5>
        {this.props.tasks ? this.renderTasks() : null}
        {this.state.tasksChanged 
          ? <button onClick={this.updateTasks}>Confirm Changes</button>
          : null}
        {(this.props.rolePOV === "teacher" || (this.props.rolePOV === "student" && !this.props.goal.teacherId))
          ? <button onClick={()=>{this.deleteGoal()}}>Delete Goal</button>
          : null}
        
      </div>
    )
  }
}

export default GoalCard