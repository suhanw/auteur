import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NavbarContainer from './navbar/navbar_container';
import PostIndexContainer from './posts/post_index_container';
import SidemenuContainer from './sidemenu/sidemenu_container';
import FollowerIndex from './follows/follower_index';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='dashboard'>
        <NavbarContainer />
        <div className='dashboard-content'>
          <div className='main-column'>
            <Switch>
              <Route path='/dashboard/blog/:blogId' render={(props) => <PostIndexContainer {...props} view='blogId' />} />
              <Route path='/dashboard/:blogId/followers' component={FollowerIndex} />
              <Route path='/dashboard/:userId/following' render={(props) => <PostIndexContainer {...props} view='following' />} />
              <Route path='/dashboard/:userId/likes' render={(props) => <PostIndexContainer {...props} view='likes' />} />
              <Route path='/dashboard' render={(props) => <PostIndexContainer {...props} view='feed' />} />
            </Switch>
          </div>
          <div className='side-column'>
            <SidemenuContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
