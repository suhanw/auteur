import * as APIUtil from '../util/user_api_util';
import { loadPostIndex } from '../actions/loading_actions';

export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_USER_LIKES = 'RECEIVE_USER_LIKES';
export const RECEIVE_USER_FOLLOWING = 'RECEIVE_USER_FOLLOWING';
export const RECEIVE_USER_ERRORS = 'RECEIVE_USER_ERRORS';

export const receiveUsers = function (users) {
  return {
    type: RECEIVE_USERS,
    payload: users,
  };
};

export const receiveUser = function (user) {
  return {
    type: RECEIVE_USER,
    payload: user,
  };
};

export const receiveUserLikes = function (likedPosts) {
  return {
    type: RECEIVE_USER_LIKES,
    payload: likedPosts,
  };
};

export const receiveUserFollowing = function (followedPosts) {
  return {
    type: RECEIVE_USER_FOLLOWING,
    payload: followedPosts,
  };
};

export const receiveUserErrors = function (errors) {
  return {
    type: RECEIVE_USER_ERRORS,
    payload: errors,
  }
}

export const fetchUserLikes = function (userId, queryParams) {
  return function (dispatch) {
    return APIUtil.fetchUserLikes(userId, queryParams).then(
      (likedPosts) => dispatch(receiveUserLikes(likedPosts)),
      (err) => dispatch(receiveUserErrors(err.responseJSON))
    );
  };
};

export const fetchUserFollowing = function (userId) {
  return function (dispatch) {
    dispatch(loadPostIndex());
    return APIUtil.fetchUserFollowing(userId).then(
      (followedPosts) => dispatch(receiveUserFollowing(followedPosts)),
      (err) => dispatch(receiveUserErrors(err.responseJSON))
    );
  };
};