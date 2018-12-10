import * as APIUtil from '../util/session_api_util';
import { clearErrors } from '../actions/clear_actions';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';
export const CONFIRM_LOGOUT = 'CONFIRM_LOGOUT';

export const receiveCurrentUser = function (user) {
  return {
    type: RECEIVE_CURRENT_USER,
    payload: user,
  };
};

export const removeCurrentUser = function () {
  return {
    type: REMOVE_CURRENT_USER,
  };
};

export const receiveSessionErrors = function (errors) {
  return {
    type: RECEIVE_SESSION_ERRORS,
    payload: errors,
  };
};


export const signup = function (user) {
  return function (dispatch) {
    return APIUtil.signup(user).then(
      (createdUser) => dispatch(receiveCurrentUser(createdUser)),
      (err) => dispatch(receiveSessionErrors(err.responseJSON))
    );
  };
};

export const login = function (user) {
  return function (dispatch) {
    return APIUtil.login(user).then(
      (currentUser) => dispatch(receiveCurrentUser(currentUser)),
      (err) => dispatch(receiveSessionErrors(err.responseJSON))
    );
  };
};

export const confirmLogout = function () {
  return {
    type: CONFIRM_LOGOUT,
    payload: {
      action: 'confirmLogout',
      data: null,
    },
  };
};

export const logout = function () {
  return function (dispatch) {
    return APIUtil.logout().then(
      () => {
        dispatch(clearErrors());
        dispatch(removeCurrentUser());
      },
      (err) => dispatch(receiveSessionErrors(err.responseJSON))
    )
  }
}
