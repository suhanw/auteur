import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PostIndexContainer from './posts/post_index/post_index_container';
import SidemenuContainer from './sidemenu/sidemenu_container';
import FollowerIndex from './follows/follower_index';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.renderNavbarPerScreenSize = this.renderNavbarPerScreenSize.bind(this);
    this.throttleResizeNavbar = this.throttleResizeNavbar.bind(this);
  }

  render() {
    // TODO: add icon at viewport bottom right to get back to top
    return (
      <div className='dashboard'>
        <div className='dashboard-content'>
          <div className='main-column'>
            <Switch>
              <Route path='/dashboard/blog/:blogId' render={(props) => <PostIndexContainer {...props} view='currentBlog' />} />
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

  componentDidMount() {
    this.renderNavbarPerScreenSize();
    window.addEventListener('resize', this.throttleResizeNavbar());
  }

  componentWillUnmount() {
    this.props.renderNavbar(null); // to remove navbar when unmounting
    window.removeEventListener('resize', this.throttleResizeNavbar());
  }

  throttleResizeNavbar() {
    let resizeTimeout;
    const that = this;
    return function (e) {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(
          () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = null;
            that.renderNavbarPerScreenSize()
          },
          1000);
      }
    };
  }

  renderNavbarPerScreenSize() {
    if (window.innerWidth <= 812) {
      this.props.renderNavbar({ view: 'navbarMobile' });
    } else {
      this.props.renderNavbar({ view: 'navbarMain' });
    }
  }
}

export default Dashboard;