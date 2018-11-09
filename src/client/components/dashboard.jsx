import React from 'react';
import {Route} from 'react-router-dom';
import NavbarContainer from './nav/navbar_container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return(
      <section className='dashboard'>
        <Route path='/' component={NavbarContainer} />
        <div className='dashboard-content'>
        </div>
      </section>
    );
  }
}

export default Dashboard;
