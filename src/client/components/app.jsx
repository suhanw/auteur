import React from 'react';
import { Switch } from 'react-router-dom';
import Dashboard from './dashboard';
import Carousel from './carousel';
import { AuthRoute, ProtectRoute } from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Switch>
        <ProtectRoute path='/dashboard' component={Dashboard} />
        <AuthRoute path='/' component={Carousel} />
      </Switch>
    );
  }
}

export default App;
