import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import SessionFormContainer from './session/session_form_container';
import AuthRoute from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Link to ='/login'>Login</Link>
        <Link to ='/signup'>Sign up</Link>
        <AuthRoute path='/login' component={SessionFormContainer} prop1={'prop1'} prop2={'prop2'} />
        <AuthRoute path='/signup' component={SessionFormContainer} />
      </div>
    );
  }
}

export default App;
