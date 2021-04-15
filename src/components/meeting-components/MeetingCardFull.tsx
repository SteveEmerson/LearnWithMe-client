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
}

class MeetingCardFull extends React.Component<MCFProps,{}>{

  renderNotes = () => {
    return(
      this.props.notes.map((note) => {
        return(
          <div>
            <p>{note.teacherId ? this.props.teacherName : this.props.studentName}</p>
            <p>{note.content}</p>
            <p>{note.createdAt}</p>
          </div>
        )
      })  
    )
  }

  render(){
    return(
      <div style={{backgroundColor:'grey'}}>
        <h4>MeetingCardFull</h4>
        {this.renderNotes()}
      </div>
    )
  }
}

export default MeetingCardFull