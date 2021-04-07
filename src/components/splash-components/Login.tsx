import * as React from 'react';

type LoginProps = {
  setAppState: Function
}
class Login extends React.Component<LoginProps, {}> {
  render() {
    return(
      <div>Got to login</div>
    )
  }
}

export default Login;