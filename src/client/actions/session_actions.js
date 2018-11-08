import * as APIUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';

export const receiveCurrentUser = function(user) {
  return {
    type: RECEIVE_CURRENT_USER,
    payload: user,
  };
};

export const receiveSignupErrors = function(errors) {
  return {
    type: RECEIVE_SESSION_ERRORS,
    payload: errors,
  }
}

export const signup = function(user) {
  return function(dispatch) {
    return APIUtil.signup(user).then(
      (createdUser) => dispatch(receiveCurrentUser(createdUser)),
      (err) => dispatch(receiveSignupErrors(err.responseJSON))
    );
  }
}
