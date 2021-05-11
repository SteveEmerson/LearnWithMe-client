import * as React from 'react';
import APIURL from '../../helpers/environment'

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
    const url: string = `${APIURL}/mtg_note/${this.props.role}_update/${this.props.note.id}`

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
    const url: string = `${APIURL}/mtg_note/${this.props.role}_delete/${this.props.note.id}`

    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(res => res.json())
    .then((json: {message: string}) => {
      this.setState({showEditNote: false})
      this.setState({newContent: ""})
      this.props.getNotes()
    })
    .catch(err => console.log(`Failed to delete note: ${err}`))
  }

  render() {
    let note = {...this.props.note}
    let noteDate = new Date(this.props.note.createdAt)
    let date = noteDate.toString().slice(0,16)
    return(
      <div className="bg-gray-200 my-4 p-2 font-semibold">
        <div key={`Note${note.id}`} >
          {!this.state.showEditNote || !this.state.allowEditNote
            ?
            <div onClick={()=>this.setState({showEditNote: true})}>
              <div className="flex flex-row justify-end space-x-2 text-xs">
                <p>{note.teacherId ? this.props.teacherName : this.props.studentName}</p>
                <p>{date}</p>
              </div>
              <p>{note.content}</p>
            </div>
            : null
          }

          {this.state.showEditNote && this.state.allowEditNote
            ?  
              <div>
                <div className="flex flex-row justify-end">
                  <button
                    className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-red-500 rounded hover:opacity-75"
                    onClick={this.deleteNote}
                  >
                    delete
                  </button>
                </div>
                
                <textarea
                className="mt-2"  
                name="task-description" 
                id="task" 
                cols={65}
                rows={3}
                defaultValue={note.content}
                onChange={(e)=>{this.setState({newContent: e.currentTarget.value})}}
                > 
                </textarea>
                <div className="flex flex-row justify-start">
                  <button
                    className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold rounded hover:opacity-75" 
                    onClick={this.cancelEditNote}
                  >
                    cancel
                  </button>
                  <button
                    className="max-h-5 px-2 py-1 flex items-center text-xs uppercase font-bold  text-white bg-gray-500 rounded hover:opacity-75"
                    onClick={this.updateNote}
                  >
                    confirm
                  </button>
                </div>
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