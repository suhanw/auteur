import React from 'react';
import {connect} from 'react-redux';
import {merge} from 'lodash';
import SessionForm from './session_form';
import {selectCurrentUser} from '../../selectors/selectors';
import {signup, login} from '../../actions/session_actions';

const mapStateToProps = function(state, ownProps) {
  const path = ownProps.match.path;
  return {
    path,
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  const path = ownProps.match.path;
  let submit = login;
  if (path === '/signup') {
    submit = signup;
  }
  return {
    submit: (user) => dispatch(submit(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);
