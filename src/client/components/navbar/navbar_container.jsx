import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NavbarGuest from './navbar_guest';
import Navbar from './navbar';
import { confirmLogout } from '../../actions/session_actions';
import { closePopover, openPopover } from '../../actions/popover_actions';
import { choosePostType } from '../../actions/post_actions';
import { selectCurrentUser, selectBlog, selectPopover, selectNavbar } from '../../selectors/selectors';


const mapStateToProps = function (state, ownProps) {
  const navbar = selectNavbar(state);
  const currentUser = selectCurrentUser(state);
  const blog = (!currentUser) ? null : selectBlog(state, currentUser.primaryBlog); // currentUser doesn't exist when not logged in
  const popover = selectPopover(state);
  const { scrollCarousel, activeSlide } = ownProps;
  return {
    navbar,
    currentUser,
    blog,
    scrollCarousel,
    activeSlide,
    popover,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    openPopover: (popover) => dispatch(openPopover(popover)),
    closePopover: () => dispatch(closePopover()),
    confirmLogout: () => dispatch(confirmLogout()),
    choosePostType: () => dispatch(choosePostType()),
  };
};


class NavbarContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pathname } = this.props.location;
    const {
      navbar,
      currentUser,
      blog,
      // scrollCarousel,
      // activeSlide,
      confirmLogout,
      choosePostType,
      openPopover,
      closePopover,
      popover } = this.props;

    if (!navbar) return null;
    // if (pathname === '/' || pathname === '/signup' || pathname === '/login' || pathname === '/login/demo') {
    if (navbar.view === 'navbarGuest') {
      return (
        <NavbarGuest
          pathname={pathname}
          scrollCarousel={navbar.scrollCarousel}
          activeSlide={navbar.activeSlide} />
      );
    }

    return (
      <Navbar
        pathname={pathname}
        currentUser={currentUser}
        blog={blog}
        confirmLogout={confirmLogout}
        popover={popover}
        openPopover={openPopover}
        closePopover={closePopover}
        choosePostType={choosePostType} />
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarContainer));
