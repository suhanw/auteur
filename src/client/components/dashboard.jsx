import React from 'react';
import { Route } from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import PostIndexContainer from './posts/post_index_container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <section className='dashboard'>
        <Route path='/' component={NavbarContainer} />
        <div className='dashboard-content'>
          <PostIndexContainer />
        </div>
      </section>
    );
  }
}

export default Dashboard;
