import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import Dashboard from './dashboard';
import NavbarContainer from './nav/navbar_container';
import Carousel from './carousel';
import {AuthRoute, ProtectRoute} from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <main>
        <Route path='/' component={NavbarContainer} />
        <Switch>
          <ProtectRoute path='/dashboard' component={Dashboard} />
          <AuthRoute path='/' component={Carousel} />
        </Switch>
      </main>
    );
  }
}

export default App;
