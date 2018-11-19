import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NavbarGuest from './navbar_guest';
import Navbar from './navbar';
import { confirmLogout } from '../../actions/session_actions';
import { selectCurrentUser } from '../../selectors/selectors';


const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state);
  const { scrollCarousel, activeSlide } = ownProps;
  return {
    currentUser,
    scrollCarousel,
    activeSlide,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    confirmLogout: () => dispatch(confirmLogout()),
  };
};


class NavbarContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pathname } = this.props.location;
    const { currentUser, scrollCarousel, activeSlide, confirmLogout } = this.props;
    if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
      return (
        <NavbarGuest
          pathname={pathname}
          scrollCarousel={scrollCarousel}
          activeSlide={activeSlide} />
      );
    }

    return (
      <Navbar
        currentUser={currentUser}
        confirmLogout={confirmLogout} />
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarContainer));
