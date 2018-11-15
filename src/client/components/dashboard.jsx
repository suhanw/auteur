import React from 'react';
import { Route } from 'react-router-dom';

import NavbarContainer from './navbar/navbar_container';
import PostIndexContainer from './posts/post_index_container';
import SidemenuContainer from './sidemenu/sidemenu_container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
  }

  render() {
    return (
      <div className='dashboard' onScroll={this.handleScroll}>
        <Route path='/' component={NavbarContainer} />
        <div className='dashboard-content'>
          <div className='main-column'>
            <PostIndexContainer />
          </div>
          <div className='side-column'>
            <SidemenuContainer />
          </div>
        </div>
      </div>
    );
  }

  handleScroll(e) {
    this.props.detectScroll(e.currentTarget.scrollTop);
  }
}

export default Dashboard;
