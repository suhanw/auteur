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

    return (
      <div className='dashboard'>
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
}

export default Dashboard;
