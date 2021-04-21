import * as React from 'react';

type Meeting = {
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
  role: string
  token: string
}

type MCFState = {
  notes: Array<Note>
}

class MeetingCardFull extends React.Component<MCFProps, MCFState>{
  constructor(props: MCFProps){
    super(props);
    this.state = {
      notes: []
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
    let url: string = `http://localhost:3000/meeting/${this.props.role}_delete/${this.props.meeting.id}`
    
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then(json => console.log(json.message))
    .catch(err => console.log(`Failed to delete meetign ${err}`));
    
  }

  editNote = () => {
    // only the one who made the note can edit or delete
  }

  deleteNote = () => {
    // only the one who made the note can edit or delete
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