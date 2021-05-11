import * as React from 'react';

class Footer extends React.Component<{},{}>{
  render(){
    return(
      <div className="h-8 bg-black text-gray-500 px-5 flex flex-row justify-between"> 
          <p className="">&copy; 2021 LearnWithMe by Steve Emerson</p>
          <div className="flex flex-row space-x-6">
            <p>Logo by Abby Emerson</p>
            <div className="">Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            
          </div>
         
      </div>
    )
  }
}

export default Footer;