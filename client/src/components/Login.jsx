import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <form className="text-center" onSubmit="">
        <fieldset>
          <label>Username </label>
          <input placeholder='Username'></input>
        </fieldset>
        <fieldset>
          <label>Password </label>
          <input placeholder='Password'></input>
        </fieldset>
      </form>
    )
  }
}