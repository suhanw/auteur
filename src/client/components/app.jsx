import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Carousel from './carousel';
import Settings from './settings/settings';
import Modal from './modals/modal';
import Drawer from './drawers/drawer';
import { AuthRoute, ProtectRoute } from '../util/route_util';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Modal />
        <Drawer />
        <Switch>
          <ProtectRoute path='/settings' component={Settings} />
          <ProtectRoute path='/dashboard' component={Dashboard} />
          <AuthRoute path='/login' component={Carousel} />
          <AuthRoute path='/signup' component={Carousel} />
          <AuthRoute exact path='/' component={Carousel} />
          <Route render={(props) => <div>This is 404 page.</div>} />
          {/* FIX: need to add 404 page */}
        </Switch>
      </div>
    );
  }
}

export default App;
