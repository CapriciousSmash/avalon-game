import React from 'react';
import { Link } from 'react-router';

// 
const Main = (props) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <div>
        {
          true ? <Link to='game'>PLAY NOW!</Link> : <Link to='signup'>SIGN UP NOW!</Link>
        }
      </div>
    </div>
  );
}

export default Main;