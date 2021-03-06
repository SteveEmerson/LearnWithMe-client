import * as React from 'react';
import MeetingCardFull from './MeetingCardFull';
import APIURL from '../../helpers/environment'

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
  role: string
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
    const url: string = `${APIURL}/mtg_note/student_get/${this.props.meeting.id}`
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
    let mtg_d = date.toString().slice(0,24);
    return(
      <div className="bg-white text-black border-l-8 border-blue-500 p-3 m-6 h-20" style={{borderColor:"blue"}}>
        <div onClick={this.toggleMCF}>
          <div className="flex flex-row justify-between">
            <p className="font-bold text-xl">
              {this.props.role === "teacher"
                ? this.props.studentName
                : this.props.teacherName
              }
            </p>
            <p className="font-bold text-base">{mtg_d.slice(0,16)} {this.formatSlotTime(mtg_d.slice(16,21))}</p>
          </div>
          <div className="flex flex-row justify-between mt-2">
            {this.state.notes.length > 0
            ? <p className="italic">
                {`${this.state.notes[0].content.slice(0,30)}...`}
              </p>
            : <p></p>}
            <p className="text-xs pb-0"> view </p>
          </div>
        </div>
        {this.state.showMCF 
          ? <MeetingCardFull 
              meeting={this.props.meeting} 
              notes={this.state.notes} 
              teacherName={this.props.teacherName}
              studentName={this.props.studentName}
              toggleMCF={this.toggleMCF}
              role={this.props.role}
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