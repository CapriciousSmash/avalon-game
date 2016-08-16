import React from 'react';
import { Link } from 'react-router';

// 
const Main = (props) => {
  return (
    <div className="inner cover">
      <h2 className="cover-heading">Welcome!</h2>
      <div>
        {
          true ? <Link  className="btn btn-lg btn-default" to='game'>PLAY NOW!</Link> : <Link to='signup'>SIGN UP NOW!</Link>
        }
      </div>
    </div>
  );
}

export default Main;