import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Carousel from './carousel';
import { AuthRoute, ProtectRoute } from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Switch>
          <ProtectRoute path='/dashboard' component={Dashboard} />
          <AuthRoute exact path='/login' component={Carousel} />
          <AuthRoute exact path='/signup' component={Carousel} />
          <AuthRoute exact path='/' component={Carousel} />
          <Route render={(props) => <div>This is 404 page.</div>} />
        </Switch>
      </div>
    );
  }
}

export default App;
