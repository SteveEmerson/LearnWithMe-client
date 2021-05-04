import * as React from 'react';

class Footer extends React.Component<{},{}>{
  render(){
    return(
      <div className="h-8 bg-black text-gray-500 flex flex-row justify-between items-center px-5"> 
          <p className="">&copy; 2021 LearnWithMe by Steve Emerson</p>
          <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      </div>
    )
  }
}

export default Footer;