import * as React from 'react';

class Footer extends React.Component<{},{}>{
  render(){
    return(
      <div className="bg-black text-gray-500 text-center"> 
          <p>&copy; 2021 LearnWithMe by Steve Emerson</p>
          <p></p>
      </div>
    )
  }
}

export default Footer;