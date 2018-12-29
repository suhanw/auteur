import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NavbarGuest from './navbar_guest';
import Navbar from './navbar';
import NavbarMobile from './navbar_mobile';
import { confirmLogout } from '../../actions/session_actions';
import { closePopover, openPopover } from '../../actions/popover_actions';
import { choosePostType } from '../../actions/post_actions';
import { fetchUnreadNotificationCount } from '../../actions/notification_actions';
import { selectCurrentUser, selectBlog, selectPopover, selectNavbar, selectUnreadNotificationCount } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state);
  return {
    navbar: selectNavbar(state),
    currentUser: currentUser,
    blog: (!currentUser) ? null : selectBlog(state, currentUser.primaryBlog), // currentUser doesn't exist when not logged in,
    popover: selectPopover(state),
    unreadNotificationCount: selectUnreadNotificationCount(state),
    scrollCarousel: ownProps.scrollCarousel,
    activeSlide: ownProps.activeSlide,
  };
};

const mapDispatchToProps = function (dispatch, _) {
  return {
    openPopover: (popover) => dispatch(openPopover(popover)),
    closePopover: () => dispatch(closePopover()),
    confirmLogout: () => dispatch(confirmLogout()),
    choosePostType: () => dispatch(choosePostType()),
    fetchUnreadNotificationCount: () => dispatch(fetchUnreadNotificationCount()),
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
      confirmLogout,
      choosePostType,
      openPopover,
      closePopover,
      popover,
      fetchUnreadNotificationCount,
      unreadNotificationCount,
    } = this.props;

    if (!navbar) return null; // is null before the renderNavbar action is dispatched
    else if (navbar.view === 'navbarGuest') {
      return (
        <NavbarGuest
          pathname={pathname}
          scrollCarousel={navbar.scrollCarousel}
          activeSlide={navbar.activeSlide} />
      );
    } else if (navbar.view === 'navbarMain') {
      return (
        <Navbar
          pathname={pathname}
          currentUser={currentUser}
          blog={blog}
          confirmLogout={confirmLogout}
          popover={popover}
          openPopover={openPopover}
          closePopover={closePopover}
          choosePostType={choosePostType}
          fetchUnreadNotificationCount={fetchUnreadNotificationCount}
          unreadNotificationCount={unreadNotificationCount} />
      );
    } else if (navbar.view === 'navbarMobile') {
      return (
        <NavbarMobile
          currentUser={currentUser}
          blog={blog}
          confirmLogout={confirmLogout} />
      );
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavbarContainer)
);
