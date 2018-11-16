import React from 'react';
import { Route } from 'react-router-dom';

import NavbarContainer from './navbar/navbar_container';
import PostIndexContainer from './posts/post_index_container';
import SidemenuContainer from './sidemenu/sidemenu_container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Pass in location as prop, so that changes in URL will 
    // change the props and hence re-render child components
    // that depend on URL
    const { location } = this.props;
    return (
      <div className='dashboard'>
        <NavbarContainer />
        <div className='dashboard-content'>
          <div className='main-column'>
            <PostIndexContainer location={location} />
          </div>
          <div className='side-column'>
            <SidemenuContainer location={location} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
