import * as React from 'react';

class Footer extends React.Component<{},{}>{
  render(){
    return(
      <div className="h-8 bg-black text-gray-500 flex justify-center items-center"> 
          <p className="">&copy; 2021 LearnWithMe by Steve Emerson</p>
      </div>
    )
  }
}

export default Footer;