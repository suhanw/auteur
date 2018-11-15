import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import NavbarContainer from './navbar/navbar_container';
import PostIndexContainer from './posts/post_index_container';
import SidemenuContainer from './sidemenu/sidemenu_container';
import { detectScroll } from '../actions/ui_actions';

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    detectScroll: (scrollTop) => dispatch(detectScroll(scrollTop)),
  };
};

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

export default connect(null, mapDispatchToProps)(Dashboard);
