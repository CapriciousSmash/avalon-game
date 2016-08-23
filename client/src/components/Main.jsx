import React from 'react';
import { Link } from 'react-router';

// 
const Main = (props) => {
  return (
    <div className="inner cover">
      <h2 className="cover-heading">Shall we play a game?</h2>
      <div>
        {
          true ? 
          <Link to='game'>
            <button className="btn playButton">
              P L A Y
            </button>
          </Link> 
          : 
          <Link to='signup'>
            <button className="btn playButton">
              SIGN UP NOW!
            </button>
          </Link>
        }
      </div>
    </div>
  );
};

export default Main;