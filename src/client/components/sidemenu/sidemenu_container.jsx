import React from 'react';
import { connect } from 'react-redux';

import { selectCurrentUser } from '../../selectors/selectors';
import Sidemenu from './sidemenu';

const mapStateToProps = function (state, ownProps) {

  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // return {
  //   ()
  // }
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidemenu);