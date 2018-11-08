import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import SessionFormContainer from './session/session_form_container';
import Dashboard from './dashboard';
import NavbarContainer from './nav/navbar_container';
import {AuthRoute, ProtectRoute} from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='splash'>
        <Route path='/' component={NavbarContainer} />
        <AuthRoute path='/login' component={SessionFormContainer} />
        <AuthRoute path='/signup' component={SessionFormContainer} />
        <ProtectRoute path='/dashboard' component={Dashboard} />
      </div>
    );
  }
}

export default App;
