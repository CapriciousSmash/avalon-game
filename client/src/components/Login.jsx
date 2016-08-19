import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <form className="text-center" onSubmit="">
        <fieldset>
          <h3>Username </h3>
          <input placeholder='Username'></input>
          <h3>Password </h3>
          <input placeholder='Password'></input><br />
          <button type="submit" value="Submit">Submit</button>
        </fieldset>
      </form>
    )
  }
}