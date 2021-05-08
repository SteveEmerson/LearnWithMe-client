import * as React from 'react';

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
  meetings?:Array<Meeting>
  goal?:Goal
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

type SCSProps = {
  student: Student
  setTSVState: Function
  token: string
}

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
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

class StudentCardSmall extends React.Component<SCSProps,{}>{

  setCurrStudent = () => {
    this.props.setTSVState({currStudent: this.props.student})
  }

  taskInfo = (taskList: Array<Task>) => {
    let complete = 0;
    let incomplete = 0;
    for(let i = 0; i < taskList.length; i++){
      taskList[i].completed ? complete++: incomplete++;
    }

    return(
      <div className="flex space-x-2"> 
        <span>Tasks </span>
        <span className="text-green-700"> {complete}</span> 
        <span className="text-red-700">{incomplete}</span>
      </div>
    ) 
  }
  render(){
    return(
      <div  
        className="bg-white text-black border-l-8 border-blue-500 max-h-20 p-2"
        onClick={()=> this.setCurrStudent()}
        style={{borderColor:"blue"}}
      >
        <div >
          <p className="font-bold text-l">{this.props.student.displayName}</p>
          <div className="flex flex-row justify-start space-x-4 ">
            <p>Meetings {this.props.student.meetings ? this.props.student.meetings.length : null}</p>
            <p>
              {this.props.student.goal ? 'Goal' : null} 
              
            </p>
            <div>
              {this.props.student.tasks && this.props.student.tasks.length > 0 
                ? this.taskInfo(this.props.student.tasks) 
                : null}
            </div>
          </div>

        </div>
      </div>
    ) 
  }
}

export default StudentCardSmall