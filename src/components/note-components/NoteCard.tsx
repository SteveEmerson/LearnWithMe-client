import * as React from 'react';

type Note = {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
  meetingId: number
  studentId: number
  teacherId: number
}

type NCProps = {
  note: Note
  teacherName: string
  teacherId: number
  studentName: string
  studentId: number
  token: string
  getNotes: Function
  role: string
}

type NCState = {
  showEditNote: boolean
  newContent: string
  allowEditNote: boolean
}

class NoteCard extends React.Component<NCProps, NCState> {
  constructor(props: NCProps){
    super(props);
    this.state = {
      showEditNote: false,
      newContent: "",
      allowEditNote: this.props.note.teacherId === this.props.teacherId || this.props.note.studentId === this.props.studentId
    }
  }

  updateNote = () => {
    const url: string = `http://localhost:3000/mtg_note/${this.props.role}_update/${this.props.note.id}`

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({
        content: this.state.newContent,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json: {data: number[]}) => {
      console.log(`${json.data[0]} note updated`)
      this.setState({showEditNote: false})
      this.setState({newContent: ""})
      this.props.getNotes()
    })
    .catch(err => console.log(`Failed to update note: ${err}`))
  }

  cancelEditNote = () => {
    this.setState({showEditNote: false})
    this.setState({newContent: ""})
  }

  deleteNote = () => {
    const url: string = `http://localhost:3000/mtg_note/${this.props.role}_delete/${this.props.note.id}`

    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json: {message: string}) => {
      console.log(`${json}`)
      this.setState({showEditNote: false})
      this.setState({newContent: ""})
      this.props.getNotes()
    })
    .catch(err => console.log(`Failed to delete note: ${err}`))
  }

  render() {
    let note = {...this.props.note}
    return(
      <div>
        <h5>Note Card</h5>
        <div key={`Note${note.id}`} >
          {!this.state.showEditNote || !this.state.allowEditNote
            ?
            <div onClick={()=>this.setState({showEditNote: true})}>
              <p>{note.teacherId ? this.props.teacherName : this.props.studentName}</p>
              <p>{note.content}</p>
              <p>{note.createdAt}</p>
            </div>
            : null
          }

          {this.state.showEditNote && this.state.allowEditNote
            ?  
              <div>
                <textarea  
                name="task-description" 
                id="task" 
                cols={30}
                rows={10}
                defaultValue={note.content}
                onChange={(e)=>{this.setState({newContent: e.currentTarget.value})}}
                > 
                </textarea>
                <button onClick={this.updateNote}>Confirm Changes</button>
                <button onClick={this.deleteNote}>Delete Note</button>
                <p onClick={this.cancelEditNote}>Cancel</p>
              </div>
            :null
            
          }
            <div>

            </div>
          </div>
      </div>
    )
  }
}

export default NoteCard;