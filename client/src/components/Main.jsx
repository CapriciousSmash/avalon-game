import React from 'react';
import { Link } from 'react-router';

// 
const Main = (props) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <div>
        {
          false ? <Link to='signup'>Sign Up!</Link> : <Link to='game'>Play Now!</Link>
        }
      </div>
    </div>
  );
}

export default Main;