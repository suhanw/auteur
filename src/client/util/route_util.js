import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../selectors/selectors';
import { openDrawer } from '../actions/drawer_actions';

const mapStateToProps = function (state) {
  const loggedIn = selectCurrentUser(state);
  return {
    loggedIn,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    openDrawer: (drawer) => dispatch(openDrawer(drawer)), // needed by Carousel component
  };
};

const Auth = function (props) {
  const { component: Component, path, loggedIn, exact, openDrawer } = props;
  return <Route path={path} exact={exact} render={function (props) {
    if (!loggedIn) { // if not logged in, then render the page
      return <Component {...props} openDrawer={openDrawer} />;
    } else {
      return <Redirect to='/dashboard' />;
    }
  }} />
};

const Protect = function (props) {
  const { component: Component, loggedIn, path, exact } = props;
  return <Route path={path} exact={exact} render={function (props) {
    if (loggedIn) { // if logged in, then render the page
      return <Component {...props} />
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
  connect(mapStateToProps, null)(Protect)
);

