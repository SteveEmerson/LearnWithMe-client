import * as React from 'react';
import NoteCard from '../note-components/NoteCard'
import APIURL from '../../helpers/environment'

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
  upcoming: boolean
}

class MeetingCardFull extends React.Component<MCFProps, MCFState>{
  constructor(props: MCFProps){
    super(props);
    this.state = {
      notes: [],
      showAddNote: false,
      newNote: "",
      upcoming: new Date(this.props.meeting.d_t) > new Date()
    }
  }

  deleteMeeting = () => {
    this.props.toggleMCF()  //probaly wont need this later
    let url: string = `${APIURL}/meeting/${this.props.role}_delete/${this.props.meeting.id}`
    
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
    const url: string = `${APIURL}/mtg_note/${this.props.role}_create`

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
            key={`N${note.id}`}
          />
        )
      })  
    )
  }

  formatSlotTime = (rawTime: string) => {
    let rawHour: string = rawTime.slice(0,2);
    let rawMinute: string = rawTime.slice(3,5);
    let rawHourNum: number = Number(rawHour);
    let formatHourNum: number = rawHourNum > 12 ? rawHourNum - 12 : rawHourNum;
    let AP: string = rawHourNum < 12 ? "am" : "pm";
    let formatTime = `${String(formatHourNum)}:${rawMinute} ${AP}`
    return formatTime
  }

  render(){
    let date = new Date(this.props.meeting.d_t);
    let mtgDate = date.toString()

    return(
      <div className="absolute top-1/4 left-1/4 bg-white text-black border border-gray-500 p-3 shadow-xl">
        <div className="flex flex-row justify-between">
          <p className="font-bold text-xl">{`${mtgDate.slice(0,16)} at ${this.formatSlotTime(mtgDate.slice(16,21))}`}</p>
          {this.state.upcoming
          ? <button
              className="max-h-5  px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-red-500
              rounded hover:opacity-75"
              onClick={this.deleteMeeting}
            >
              delete
            </button>
          : null}
        </div>
        <p className="font-bold">
          {`${this.state.upcoming ? "Upcoming meeting" : "Meeting"} between ${this.props.studentName} and ${this.props.teacherName}.`}
        </p>
        
        {this.renderNotes()}
        {this.state.showAddNote
          ? 
            <div className="bg-gray-200 p-4">
              <textarea 
                className="px-1" 
                name="task-description" 
                id="task" 
                cols={65}
                rows={4}
                onChange={(e)=>{this.setState({newNote: e.currentTarget.value})}}
              > 
              </textarea>
              <div className="flex flex-row justify-start">
                <button
                  className="self-center max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold rounded hover:opacity-75"  
                  onClick={this.cancelAddNote}
                >
                  cancel
                </button>
                <button
                  className="self-center max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"  
                  onClick={this.addNote}
                >
                  confirm
                </button>
              </div>
            </div>
          : null}
        <div className="flex flex-col">
          {!this.state.showAddNote
           ? <button
              className="self-center max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75" 
              onClick={() => {this.setState({showAddNote:true})}}
            >
              add note
            </button>
          : null
          }
          <button
            className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  rounded hover:opacity-75"
            onClick={() => this.props.toggleMCF()}
          >
            close
          </button>
        </div>
      </div>
    )
  }
}

export default MeetingCardFull