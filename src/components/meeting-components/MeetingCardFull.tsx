import * as React from 'react';

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

type MCFProps = {
  meeting: Meeting
  notes: Array<Note>
  teacherName: string
  studentName: string
  toggleMCF: Function
}

type MCFState = {
  notes: Array<Note>

}

class MeetingCardFull extends React.Component<MCFProps, MCFState>{
  constructor(props: MCFProps){
    super(props);
    this.state = {
      notes: [],
    }
  }


  renderNotes = () => {
    return(
      this.props.notes.map((note) => {
        return(
          <div key={`Note${note.id}`}>
            <p>{note.teacherId ? this.props.teacherName : this.props.studentName}</p>
            <p>{note.content}</p>
            <p>{note.createdAt}</p>
          </div>
        )
      })  
    )
  }

  deleteMeeting = () => {
    this.props.toggleMCF()  //probaly wont need this later
  }

  render(){
    return(
      <div style={{backgroundColor:'grey'}}>
        <h4>MeetingCardFull</h4>
        <h5>
          {`Meeting between ${this.props.studentName} and ${this.props.teacherName} on ${this.props.meeting.d_t}`}
        </h5>
        <button onClick={this.deleteMeeting}>Delete Meeting</button>
        {this.renderNotes()}
        <p onClick={() => this.props.toggleMCF()}>Close</p>
      </div>
    )
  }
}

export default MeetingCardFull