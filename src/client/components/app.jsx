import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Carousel from './carousel/carousel';
import Settings from './settings/settings';
import SearchPage from './search/search_page';
import Modal from './modals/modal';
import ChatDrawer from './chats/chat_drawer';
import Drawer from './drawers/drawer';
import { ErrorPage } from './errors/errors';
import { AuthRoute, ProtectRoute } from '../util/route_util';
import NavbarContainer from './navbar/navbar_container';
import { GlobalContext } from './global_ context_provider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  render() {
    return (
      <div>
        <Modal />
        <Drawer />
        <NavbarContainer />
        <Switch>
          <ProtectRoute path='/search/:query' component={SearchPage} />
          <ProtectRoute path='/settings' component={Settings} />
          <ProtectRoute path='/dashboard' component={Dashboard} />
          <AuthRoute path='/login' component={Carousel} />
          <AuthRoute path='/signup' component={Carousel} />
          <AuthRoute exact path='/' component={Carousel} />
          <Route component={ErrorPage} />
        </Switch>
        {this.isLoggedIn() ? <ChatDrawer /> : null}
      </div>
    );
  }

  isLoggedIn() {
    return this.context.currentUser;
  }
}

App.contextType = GlobalContext;

export default App;
