import * as React from 'react';
import APIURL from '../../helpers/environment';

type GCProps = {
  rolePOV: string
  student: Student
  goal: Goal
  token: string
  tasks?: Array<Task>
  setGParState?: Function
  getStudentGoals?: Function
  getGoals: Function
  getTasks: Function
}

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
  newDate: Date | null
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
      newGoalDesc: "",
      newDate: null,
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
      this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
      this.setState({tasksChanged: false})
    }

    // if(this.state.updatedTasks && this.props.tasks && this.props.tasks.length > 0){
    //   if(this.state.updatedTasks.length !== this.props.tasks.length){
    //     this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
    //   }
    // }

  }

  handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({newDate: new Date(e.currentTarget.value + "T07:00:00")})
  }

  getDateString = (d: Date): string => {
    return d.toISOString().slice(0,10) + "T07:00"
  }

  toggleEditForm = () => {
    if(this.state.canEdit){this.setState({showEditForm: !this.state.showEditForm})}
  }

  cancelEdit = () => {
    this.toggleEditForm();
    this.setState({newGoalDesc: ""})
    this.setState({newDate: null})
    this.setState({newTasks: []})
    this.setState({oldTasks: []})
    this.setState({newTaskDescription: ""})
    this.setState({updatedTasks: this.props.tasks ? JSON.parse(JSON.stringify(this.props.tasks)) : []})
  }

  handleTaskChange = (id: number | undefined) => {
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
        const url: string = `${APIURL}/task/${this.props.rolePOV}_update/${task.id}`
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
          // console.log(json.data[0])

          // let updatedTasksDeepCopy = JSON.parse(JSON.stringify(this.state.updatedTasks));

          // if(this.props.rolePOV === "teacher" && this.props.setGParState){
          //   let cStud: Student = {
          //     id: this.props.student.id,
          //     displayName: this.props.student.displayName,
          //     email: this.props.student.email,
          //     availability: this.props.student.availability,
          //     meetings: this.props.student.meetings,
          //     goal: this.props.goal,
          //     tasks: updatedTasksDeepCopy
          //   }
          //   this.props.setGParState({currStudent: cStud});
          // }

          this.props.getTasks();
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
        const url = `${APIURL}/task/${this.props.rolePOV}_create`
    
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
          this.props.getTasks()
          this.setState({newTasks: []})
        })
        .catch(err => console.log(`Error in adding tasks ${err}`))
      });
    }
  }

  removeTasks = () => {
    let oldTasks: Array<Task> = this.state.oldTasks

    if (oldTasks.length > 0){
      oldTasks.forEach((task) => {
        const url = `${APIURL}/task/${this.props.rolePOV}_delete/${task.id}`
   
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
          this.props.getTasks();
          this.setState({oldTasks: []})
        })
        .catch(err => console.log(`Error in removing tasks ${err}`))
      });
    }
  }

  updateGoal = () => {
    this.toggleEditForm()
    const url = `${APIURL}/goal/${this.props.rolePOV}_update/${this.props.goal.id}`
    
    let description: string = (!this.state.newGoalDesc) ? this.props.goal.description : this.state.newGoalDesc;
    let date: Date | null = (!this.state.newDate) ? new Date(this.props.goal.targetDate + "T07:00:00") : this.state.newDate;
    
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({
        description: description,
        targetDate: date
      }),
      headers: new Headers ({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json: {data: number[]}) => {
      // let newGoal: Goal = this.props.goal;
      // newGoal.description = this.state.newGoalDesc;
      // newGoal.targetDate = this.state.newDate;

      // if(this.props.rolePOV === "teacher" && this.props.setGParState) {
      //   let cStud: Student = {
      //     id: this.props.student.id,
      //     displayName: this.props.student.displayName,
      //     email: this.props.student.email,
      //     availability: this.props.student.availability,
      //     meetings: this.props.student.meetings,
      //     goal: newGoal,
      //     tasks: this.state.updatedTasks
      //   }
      //   this.props.setGParState({currStudent: cStud});
      // }

      this.props.getGoals()

      // *******CHANGED 050121 1028********
      this.addTasks()
      this.removeTasks()

    })
    .catch(err => console.log(`Error in updating goal ${err}`))
  }

  renderTasks = () => {
    let taskList: Array<Task> | undefined = (this.state.updatedTasks && this.state.updatedTasks.length > 0)
      ? this.state.updatedTasks
      : this.props.tasks
    
      if (taskList && taskList.length > 1) {
        taskList.sort((a,b) => {
          if(a.createdAt && b.createdAt){
            if(a.createdAt > b.createdAt){
              return 1
            }else if (a.createdAt < b.createdAt){
              return -1
            }else{
              if(a.description < b.description){
                return -1
              }else{
                return 1
              }
            }    
          }
          return 1
        })
      }
    
    return(
      <div className="text-base font-semibold pl-2">
        {(taskList) 
          ? taskList.map((task) => {
            return(
              <div key={`T${task.description.slice(5)}${task.id}`}>
                <p className={` hover:text-blue-500 ${task.completed?"line-through":"no-underline"}`}
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
    const url=`${APIURL}/goal/${this.props.rolePOV}_delete/${this.props.goal.id}`
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json) => {
      this.deleteAllTasks()
      this.props.getGoals();
    })
    .catch(err => console.log(`Error deleting goal: ${err}`));
  }

  deleteAllTasks = () => {
    if(this.props.tasks && this.props.tasks.length > 0){
      this.props.tasks.forEach((task: Task) => {
        const url=`${APIURL}/task/${this.props.rolePOV}_delete/${task.id}`
        fetch(url, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.props.token
          })
        })
        .then(res => res.json())
        .then((json) => {
          this.setState({updatedTasks: []})

          if(this.props.getTasks){
            this.props.getTasks();
          }
        })
        .catch(err => console.log(`Error deleting task: ${err}`));
      });
    }
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

  renderEditGoal = () => {
    let goal = this.props.goal
    return(
      <div
        className={`flex flex-col ${!this.state.showEditForm? "hidden" : null}` }
        id="change-goal-info"
      >
        {(this.props.rolePOV === "teacher" || (this.props.rolePOV === "student" && !this.props.goal.teacherId))
        ? <div className="flex flex-row justify-end">
            <button
              className="max-h-5  px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-red-500
              rounded hover:opacity-75"
              onClick={()=>{this.deleteGoal()}}
            >
              delete
            </button>
          </div>

        : null}
        <label className="font-semibold " htmlFor="goal-description">Description</label>
        <textarea
          className="bg-gray-100 px-1"
          onChange=
          {(e: React.FormEvent<HTMLTextAreaElement>) => this.setState({newGoalDesc: e.currentTarget.value})}  id="goal-description"
          name="goal-description"
          cols={20}
          rows={3}
          defaultValue={goal.description}
        />
        <label className="font-semibold mt-4" htmlFor="target-date">Target Date</label>
        <input  
          type='date' 
          id="target-date" 
          name="goal-target-date"
          defaultValue={String(goal.targetDate)}
          onChange={this.handleDate}
        />

        <div className="my-2">
          <label className="font-semibold mt-2" htmlFor="tasks">Tasks</label>
          {this.renderEditTasks()}
          <div className="flex flex-row justify-start space-x-4">
            <input
              className="bg-gray-100" 
              type="text"
              value={this.state.newTaskDescription}
              onChange={(e: React.FormEvent<HTMLInputElement>)=>
                {this.setState({newTaskDescription:e.currentTarget.value})}}/>
            <button
              className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" 
              onClick={() => {this.addStagedTask()}}
            >
              add
            </button>
          </div>
        </div>
        
        <div className="flex flex-row justify-start">
          <button
            className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  rounded hover:opacity-75"
            onClick={this.cancelEdit}
          >
            cancel
          </button>
          <button
            className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" 
            onClick={this.updateGoal}
          >
            confirm
          </button>
        </div>  
      </div>
    )
  }

  renderEditTasks = () => {
    let taskList: Array<Task> | undefined = (this.state.updatedTasks && this.state.updatedTasks.length > 0)
    ? this.state.updatedTasks
    : this.props.tasks

    return(
      taskList?.map((task) => {
        return(
          <div
            className="flex flex-row space-x-4"
            key={`${task.description.slice(5)}${task.id}`}
          >
            <p className="text-sm">{task.description}</p>
            <button
              className="text-sm font-bold flex items-center"
              onClick={() => this.removeStagedTask(task)}
            >
              x
            </button>
          </div>
        )
      })
    )
  }

  render(){
    
    let description: string = (!this.state.newGoalDesc) ? this.props.goal.description : this.state.newGoalDesc;
    let date: Date = (!this.state.newDate) ? new Date(this.props.goal.targetDate + "T07:00:00") : this.state.newDate;
    return(
      <div className="bg-white text-black border p-2">
        <div className=" bg-gray-300 px-2" hidden={this.state.showEditForm} id="goal-info" onClick={this.toggleEditForm}>
          <p className="font-bold text-xl ">{description}</p>
          <p className="font-bold">Complete by: {date.toDateString().slice(0,10)}</p>
          {this.state.canEdit ?  <p className="text-xs text-right">edit</p> : null}
        </div>

        {this.renderEditGoal()}

        <div hidden={this.state.showEditForm}>
          {this.props.tasks ? this.renderTasks() : null}
          <div className="flex flex-row justify-end">
            {this.state.tasksChanged 
              ? <button
                className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" 
                onClick={this.updateTasks}>
                  confirm
                </button>
              : null}
          </div>
 
        </div>

      </div>
    )
  }
}

export default GoalCard