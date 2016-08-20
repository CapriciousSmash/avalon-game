import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <div className="loginsignup">
        <form className="text-center" action="/login" method="post">
          <fieldset>
            <h3>Username </h3>
            <input placeholder='Username'></input>
            <h3>Password </h3>
            <input type='password' placeholder='Password'></input><br />
            <button type="submit" value="Submit">Submit</button>
          </fieldset>
        </form>
        <form className="text-center" action="/signup" method="post">
          <fieldset>
            <h3>Username </h3>
            <input placeholder='Username'></input>
            <h3>Password </h3>
            <input type='password' placeholder='Password'></input><br />
            <button type="submit" value="signup">Sign Up</button>
          </fieldset>
        </form>
      </div>
    )
  }
}