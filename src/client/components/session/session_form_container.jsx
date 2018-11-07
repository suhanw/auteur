import React from 'react';
import {connect} from 'react-redux';
import {merge} from 'lodash';
import SessionForm from './session_form';
import {selectCurrentUser} from '../../selectors/selectors';

const mapStateToProps = function(state, ownProps) {
  let user = { //default if no current user logged in
    email: '',
    username: '',
    password: '',
  };
  user = merge(user, selectCurrentUser(state));

  return {
    user,
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);
