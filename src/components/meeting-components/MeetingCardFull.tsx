import * as React from 'react';
import NoteCard from '../note-components/NoteCard'

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
  getMeetings: Function
  getNotes: Function
}

type MCFState = {
  notes: Array<Note>
  showAddNote: boolean
  newNote: string
}

class MeetingCardFull extends React.Component<MCFProps, MCFState>{
  constructor(props: MCFProps){
    super(props);
    this.state = {
      notes: [],
      showAddNote: false,
      newNote: ""
    }
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
    .then(json => {
      console.log(json.message)
      this.props.getMeetings()
    })
    .catch(err => console.log(`Failed to delete meeting ${err}`));
    
  }

  addNote = () => {
    const url: string = `http://localhost:3000/mtg_note/${this.props.role}_create`

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        content: this.state.newNote,
        meetingId: this.props.meeting.id
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((note: Note) => {
      console.log(note)
      this.setState({showAddNote: false})
      this.setState({newNote: ""})
      this.props.getNotes()
    })
    .catch(err => console.log(`Failed to create note: ${err}`))
  }

  cancelAddNote = () => {
    this.setState({showAddNote: false})
    this.setState({newNote: ""})
  }

  renderNotes = () => {
    return(
      this.props.notes.map((note) => {
        return(
          <NoteCard 
            note={note}
            teacherName={this.props.teacherName}
            teacherId={this.props.meeting.teacherId}
            studentId={this.props.meeting.studentId}
            studentName={this.props.studentName}
            token={this.props.token}
            getNotes={this.props.getNotes}
            role={this.props.role}
          />
        )
      })  
    )
  }

  render(){
    return(
      <div style={{backgroundColor:'grey'}}>
        <h4>MeetingCardFull</h4>
        <h5>
          {`Meeting between ${this.props.studentName} and ${this.props.teacherName} on ${this.props.meeting.d_t}`}
        </h5>
        {new Date(this.props.meeting.d_t) > new Date() 
          ? <button onClick={this.deleteMeeting}>Delete Meeting</button>
          : null}
        
        {this.renderNotes()}
        {this.state.showAddNote
          ? 
            <div>
              <textarea  
                name="task-description" 
                id="task" 
                cols={30}
                rows={10}
                onChange={(e)=>{this.setState({newNote: e.currentTarget.value})}}
              > 
              </textarea>
              <button onClick={this.addNote}>Add Note</button>
              <button onClick={this.cancelAddNote}>Cancel</button>
            </div>
          : null}
        <hr/>
        <p onClick={() => {this.setState({showAddNote:true})}}>+ Note</p>
        <p onClick={() => this.props.toggleMCF()}>Close</p>
      </div>
    )
  }
}

export default MeetingCardFull