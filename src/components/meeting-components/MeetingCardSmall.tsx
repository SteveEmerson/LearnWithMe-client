import * as React from 'react';
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

type MCSProps = {
  meeting: Meeting
  token: string
  teacherName: string
  studentName: string
  getMeetings: Function
}

type MCSState = {
  notes: Array<Note>
  showMCF: boolean
}

class MeetingCardSmall extends React.Component<MCSProps,MCSState>{
  constructor(props: MCSProps){
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
    const url: string = `http://localhost:3000/mtg_note/student_get/${this.props.meeting.id}`
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
    return(
      <div>
        <div onClick={this.toggleMCF}>
          <h4>MeetingCardSmall</h4>
          <p>meeting id: {this.props.meeting.id}</p>
          <p>{this.props.meeting.d_t}</p>
          <p>N {this.state.notes.length}</p>
        </div>
        {this.state.showMCF 
          ? <MeetingCardFull 
              meeting={this.props.meeting} 
              notes={this.state.notes} 
              teacherName={this.props.teacherName}
              studentName={this.props.studentName}
              toggleMCF={this.toggleMCF}
              role={"student"}
              getMeetings={this.props.getMeetings}
              getNotes={this.getNotes}
              token={this.props.token}
            /> 
          : null}
      </div>

    )
  }
}

export default MeetingCardSmall