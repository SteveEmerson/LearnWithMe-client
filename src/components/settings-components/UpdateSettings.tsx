import * as React from 'react';

type USProps = {
  setAppState: Function
}

type USState = {
  email: string
  password: string
  role: string
  displayName: string
}

class UpdateSettings extends React.Component<USProps, USState>{

  render(){

    return(
      <div>
        Got to update settings
      </div>
    )
  }
}

export default UpdateSettings