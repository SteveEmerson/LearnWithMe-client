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
  oldTasks: Array<Task>
  newTaskDescription: string
  tasksChanged: boolean
  canEdit: boolean | number
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
      newTaskDescription: "",
      newTasks: [],
      oldTasks: [],
      showEditForm: false,
      tasksChanged: false,
      canEdit: ((this.props.rolePOV === "teacher" && this.props.goal.teacherId) || 
      (this.props.rolePOV === "student" && !this.props.goal.teacherId))
    }
  }

  componentDidMount(){
    // Setting the state to a props that is an object doesnt work ... creates a reference
    this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
   
  }


  componentDidUpdate(prevProps: GCProps, prevState: GCState){
    
    if(prevProps.goal.id !== this.props.goal.id ){
      console.log("Got here")
      this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
      this.setState({tasksChanged: false})
    }

    if(this.props.tasks && this.state.updatedTasks){
      //console.log(this.compareTaskArrays(this.props.tasks, this.state.updatedTasks))
    }

    //console.log(this.props.tasks);
    //console.log(this.state.updatedTasks)

  }

  handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({newDate: new Date(e.currentTarget.value)})
  }

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10) + "T07:00"
  }

  toggleEditForm = () => {
    if(this.state.canEdit){this.setState({showEditForm: !this.state.showEditForm})}
  }

  cancelEdit = () => {
    this.toggleEditForm();
    this.setState({newGoalDesc: this.props.goal.description})
    this.setState({newDate: this.props.goal.targetDate})
    this.setState({newTasks: []})
    this.setState({oldTasks: []})
    this.setState({newTaskDescription: ""})
    this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
  }

  handleTaskChange = (id: number | undefined) => {
    console.log("Got handle task change");
    let tempTasks: Array<Task> = this.state.updatedTasks ? this.state.updatedTasks : [];
    let currentTaskIndex: number = tempTasks.findIndex(task => task.id === id);
    let currentTask :Task = tempTasks[currentTaskIndex];
    currentTask.completed = !currentTask.completed;
    tempTasks[currentTaskIndex] = currentTask;
    this.setState({updatedTasks: tempTasks})
    this.checkTasksChanged()
  }


  checkTasksChanged = () => {

    let uT: Array<Task> = this.state.updatedTasks ? this.state.updatedTasks : [];
    let pT: Array<Task> = this.props.tasks ? this.props.tasks : [];

    console.log('Tasks changed? ', uT?.length !== pT?.length || !this.compareTaskArrays(uT, pT))
    console.log(uT)
    console.log(pT)
    this.setState({tasksChanged: uT?.length !== pT?.length || !this.compareTaskArrays(uT, pT)}) 
  }

  compareTaskArrays = (a: Array<Task>, b: Array<Task>) => {
    for(let i: number = 0; i < a.length; i++){
      let inB: number = b.findIndex(task => task.id === a[i].id)
      if(inB >= 0){
        if (!this.compareTasks(a[i], b[inB])) return false
      }else{
        return false
      }
    }
    return true
  }

  compareTasks = (task1: Task, task2: Task): boolean => {

    if(task1.description !== task2.description){
      return false
    }

    if(task1.completed !== task2.completed){
      return false
    }

    return true
  }

  updateTasks = () => {
    let changedTasks: Array<Task> | undefined;
    if(this.props.tasks && this.state.updatedTasks){
      changedTasks = 
      this.state.updatedTasks.filter((task: Task) => {
        let inProps = this.props.tasks?.findIndex(pTask => pTask.id === task.id);
          if(inProps && inProps >= 0 && this.props.tasks){
            return !this.compareTasks(task, this.props.tasks[inProps])
          }else{
            return true
          }
      });
    }else{
      changedTasks = undefined
    }

    if (changedTasks && changedTasks.length > 0) {
      changedTasks.forEach((task: Task) => {
        console.log(task)
        console.log(this.props.student.id, task.studentId)
        const url = `http://localhost:3000/task/${this.props.rolePOV}_update/${task.id}`
        console.log(url)
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

          let updatedTasksDeepCopy = JSON.parse(JSON.stringify(this.state.updatedTasks));

          if(this.props.rolePOV === "teacher" && this.props.setGParState){
            let cStud: Student = {
              id: this.props.student.id,
              displayName: this.props.student.displayName,
              email: this.props.student.email,
              availability: this.props.student.availability,
              meetings: this.props.student.meetings,
              goal: this.props.goal,
              tasks: updatedTasksDeepCopy
            }
            this.props.setGParState({currStudent: cStud});
          }

          if(this.props.rolePOV === "student" && this.props.setGParState){
            this.props.setGParState({tasks: updatedTasksDeepCopy});
          }
          this.setState({tasksChanged: false});

        })
        .catch(err => console.log(`Error in updating tasks ${err}`))
      });
    }
    
  }

  addTasks = () => {
    let newTasks = this.state.newTasks

    if (newTasks.length > 0){
      newTasks.forEach((task) => {
        const url = `http://localhost:3000/task/${this.props.rolePOV}_create`
    
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            description: task.description,
            goalId: this.props.goal.id,
            studentId: this.props.student.id
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
          })
        })
        .then(res => res.json())
        .then((task: Task) => {
          console.log(task)
        })
        .catch(err => console.log(`Error in adding tasks ${err}`))
      });
    }
  }

  removeTasks = () => {
    let oldTasks: Array<Task> = this.state.oldTasks

    if (oldTasks.length > 0){
      oldTasks.forEach((task) => {
        const url = `http://localhost:3000/task/${this.props.rolePOV}_delete/${task.id}`
   
        fetch(url, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
          })
        })
        .then(res => res.json())
        .then((json: {message: string}) => {
          console.log(json)
        })
        .catch(err => console.log(`Error in removing tasks ${err}`))
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
          tasks: this.state.updatedTasks
        }
        this.props.setGParState({currStudent: cStud});
      }

      if(this.props.rolePOV === "student" && this.props.getStudentGoals){
        this.props.getStudentGoals();
      }

      this.addTasks()
      this.removeTasks()

    })
    .catch(err => console.log(`Error in updating goal ${err}`))
  }

  renderTasks = () => {
    return(
      <div>
        {(this.state.updatedTasks) 
          ? this.state.updatedTasks.map((task) => {
            return(
              <div key={`T${task.description.slice(5)}${task.id}`}>
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
          <div key={`${task.description.slice(5)}${task.id}`}>
            <p>{task.description}</p>
            <button onClick={() => this.removeStagedTask(task)}>X</button>
          </div>
        )
      })
    )
  }


  
  removeStagedTask = (remTask: Task) => {
    let temp: Array<Task> | undefined= this.state.updatedTasks?.filter((task) => task.id !== remTask.id)
    this.setState({updatedTasks: temp})

    this.setState({oldTasks: [...this.state.oldTasks, remTask]})
  }

  addStagedTask(){
    let nt: Task = {
      id: 0,
      description: this.state.newTaskDescription, 
      completed: false, 
      goalId: this.props.goal.id,
      studentId: this.props.student.id,
      teacherId:  this.props.goal.teacherId 
    }

    let temp: Array<Task> | undefined = this.state.updatedTasks
    if(temp) {
      temp.push(nt)
      this.setState({updatedTasks: temp})
    } 
    
    this.setState({newTaskDescription: ""})
    this.setState({newTasks: [...this.state.newTasks, nt]})
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
          {this.state.canEdit ?  <p>click goal to edit</p> : null}
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
            <input 
              type="text" 
              value={this.state.newTaskDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>)=>
                {this.setState({newTaskDescription:e.currentTarget.value})}}/>
            <button onClick={() => {this.addStagedTask()}}>add</button>
          </div>
          
          <p onClick={this.updateGoal}>confirm changes</p>
          <p onClick={this.cancelEdit}>cancel</p>
        </div>
        <hr/>
        <h5>Tasks</h5>
        <div hidden={this.state.showEditForm}>
          {this.props.tasks ? this.renderTasks() : null}
          {this.state.tasksChanged 
            ? <button onClick={this.updateTasks}>Confirm Changes</button>
            : null}
        </div>
        {(this.props.rolePOV === "teacher" || (this.props.rolePOV === "student" && !this.props.goal.teacherId))
          ? <button onClick={()=>{this.deleteGoal()}}>Delete Goal</button>
          : null}
        
      </div>
    )
  }
}

export default GoalCard