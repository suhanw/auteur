import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../selectors/selectors';
import { openDrawer } from '../actions/drawer_actions';
import { renderNavbar } from '../actions/navbar_actions';

const mapStateToProps = function (state) {
  return {
    loggedIn: selectCurrentUser(state),
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    openDrawer: (drawer) => dispatch(openDrawer(drawer)), // needed by Carousel component
    renderNavbar: (props) => dispatch(renderNavbar(props)), // for Carousel
  };
};

const Auth = function (props) {
  const { component: Component, path, loggedIn, exact, openDrawer, renderNavbar } = props;
  return <Route path={path} exact={exact} render={function (props) {
    if (!loggedIn) { // if not logged in, then render the page
      return <Component {...props} openDrawer={openDrawer} renderNavbar={renderNavbar} />;
    } else {
      return <Redirect to='/dashboard' />;
    }
  }} />
};

const Protect = function (props) {
  const { component: Component, path, loggedIn, exact, renderNavbar } = props;
  return <Route path={path} exact={exact} render={function (props) {
    if (loggedIn) { // if logged in, then render the page
      return <Component {...props} renderNavbar={renderNavbar} />
    } else {
      return <Redirect to='/' />
    }
  }} />
}

// React components will initial render according to current location, 
// but will not re-render on route transitions / location changes
// because the new location is not passed in as prop, i.e. blocked updates.
// Using withRouter is passing a prop that changes when location changes
export const AuthRoute = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Auth)
);


export const ProtectRoute = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Protect)
);

