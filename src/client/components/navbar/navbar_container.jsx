import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NavmenuGuest from './navmenu_guest';
import { logout } from '../../actions/session_actions';
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
    logout: () => dispatch(logout()),
  };
};


class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, scrollCarousel, activeSlide, logout } = this.props;
    const { pathname } = this.props.location;
    return (
      <NavmenuGuest
        pathname={pathname}
        currentUser={currentUser}
        scrollCarousel={scrollCarousel}
        activeSlide={activeSlide}
        logout={logout} />
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
