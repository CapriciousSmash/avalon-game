import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <form onSubmit="">
        <fieldset>
          <label>Username</label>
          <input placeholder='Username'></input>
        </fieldset>
          <label>Password</label>
          <input placeholder='Password'></input>
        <fieldset>
        </fieldset>
      </form>
    )
  }
}