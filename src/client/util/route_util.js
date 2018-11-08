import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {selectCurrentUser} from '../selectors/selectors';

const AuthRoute = function(props) {
  // const ({ component:Component, path, loggedIn, exact }) = props;
  const {component: Component, path, loggedIn, exact} = props;
  // debugger
  return <Route path={path} exact={exact} render={function(props) {
    if (!loggedIn) {
      return <Component {...props} />;
    } else {
      return <Redirect to='/dashboard' />;
    }
  }} />
};



const mapStateToProps = function(state) {
  const loggedIn = selectCurrentUser(state);
  return {
    loggedIn,
  };
};

export default withRouter( // need withRouter so AuthRoute listens for URL changes
  connect(mapStateToProps, null)(AuthRoute)
);
