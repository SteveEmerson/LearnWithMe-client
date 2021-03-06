import * as React from 'react';
import APIURL from '../../helpers/environment';
import MeetingCardFull from './MeetingCardFull';

type Meeting= {
  id: number,
  d_t: Date,
  teacherId: number,
  studentId: number,
  createdAt: Date,
  updatedAt: Date
}

type Note = {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
  meetingId: number
  studentId: number
  teacherId: number
}

type MCMProps = {
  meeting: Meeting
  token: string
  teacherName: string
  studentName: string
  getMeetings: Function
}

type MCMState = {
  notes: Array<Note>
  showMCF: boolean
}

class MeetingCardMini extends React.Component<MCMProps,MCMState>{
  constructor(props: MCMProps){
    super(props);
    this.state = {
      notes: [],
      showMCF: false,
    }
  }

  componentDidMount(){
    this.getNotes();
  }

  getNotes = () => {
    const url: string = `${APIURL}/mtg_note/teacher_get/${this.props.meeting.id}`
    fetch(url,
      {
          method: 'GET',
          headers: new Headers ({
          'Content-Type': 'application/json',
          'Authorization': this.props.token
          })
      })
      .then((res) => res.json())
      .then((data: Array<Note>) => {
        this.setState({notes: data})
      })
      .catch(err => {
        console.log(`Error in fetch: ${err}`)
      }) 
  }

  toggleMCF = () => {
    this.setState({
      showMCF: !this.state.showMCF
    })
  }

  render(){
    let date = new Date(this.props.meeting.d_t);
    let mtg_d = date.toString().slice(0,10);
    return(
      
      <div className="">
        <div className="flex flex-row space-x-3 my-3 hover:text-blue-500" onClick={this.toggleMCF}>
          <p className="font-bold">{mtg_d}</p>
          <p>Notes {this.state.notes.length}</p>
        </div>
        {this.state.showMCF 
          ? <MeetingCardFull 
              meeting={this.props.meeting} 
              notes={this.state.notes} 
              teacherName={this.props.teacherName}
              studentName={this.props.studentName}
              toggleMCF={this.toggleMCF}
              role={'teacher'}
              getMeetings={this.props.getMeetings}
              getNotes={this.getNotes}
              token={this.props.token}
            /> 
          : null
        }
      </div>
    )
  }
}

export default MeetingCardMini