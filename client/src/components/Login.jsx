import React from 'react';

export default class SignIn extends React.Component {
  render() {
    return (
      <div className="container loginSignupContainer">
        <h3 className="sectionTitle">L O G I N</h3>
        <form className="form-horizontal" action="/signin" method="post">
            <div className="form-group">
              <label for="username1" className="col-sm-2 col-sm-offset-1 control-label">Username</label>
              <div className="col-sm-7">
                <input id="username1" type="text" className="form-control" placeholder="Username"/>
              </div>
            </div>
            <div className="form-group">
              <label for="password2" className="col-sm-2 col-sm-offset-1 control-label">Password</label>
              <div className="col-sm-7">
                <input type="password" className="form-control" id="password2" placeholder="Password"/>
              </div>
            </div>
            <button className="btn" type="submit" value="Submit">S u b m i t</button>
        </form>
        <br />
        <h3 className="sectionTitle">S I G N U P</h3>
        <form className="form-horizontal" action="/signup" method="post">
            <div className="form-group">
              <label for="username1" className="col-sm-2 col-sm-offset-1 control-label">Username</label>
              <div className="col-sm-7">
                <input id="username1" type="text" className="form-control" placeholder="Username"/>
              </div>
            </div>
            <div className="form-group">
              <label for="password2" className="col-sm-2 col-sm-offset-1 control-label">Password</label>
              <div className="col-sm-7">
                <input type="password" className="form-control" id="password2" placeholder="Password"/>
              </div>
            </div>
            <button className="btn" type="submit" value="Submit">S u b m i t</button>
        </form>
      </div>
    );
  }
}