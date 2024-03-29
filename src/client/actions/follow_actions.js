import * as APIUtil from '../util/api_util/follow_api_util';
import { createNotification } from '../actions/notification_actions';

export const FOLLOW_BLOG = 'FOLLOW_BLOG';
export const UNFOLLOW_BLOG = 'UNFOLLOW_BLOG';
export const RECEIVE_FOLLOWERS = 'RECEIVE_FOLLOWERS';
export const RECEIVE_FOLLOW_ERRORS = 'RECEIVE_FOLLOW_ERRORS';

export const followBlog = function (currentUser) {
  return {
    type: FOLLOW_BLOG,
    payload: currentUser,
  };
};

export const unfollowBlog = function (currentUser) {
  return {
    type: UNFOLLOW_BLOG,
    payload: currentUser,
  };
};

export const receiveFollowers = function (followers) {
  return {
    type: RECEIVE_FOLLOWERS,
    payload: followers,
  }
}

export const receiveFollowErrors = function (errors) {
  // TODO: add follow errors reducer
  return {
    type: RECEIVE_FOLLOW_ERRORS,
    payload: errors,
  };
};

export const createFollow = function (blogId) {
  return function (dispatch) {
    return APIUtil.createFollow(blogId).then(
      (currentUser) => {
        // const notification = {
        //   type: 'follow',
        //   notify: , // TODO: TO CREATE NOTIFICATION, NEED BLOG.AUTHOR
        //   notifiable: currentUser,
        //   notifiableModel: 'User',
        // };
        // dispatch(createNotification(notification));
        dispatch(followBlog(currentUser))
      },
      (err) => dispatch(receiveFollowErrors(err.responseJSON)),
    );
  };
};

export const deleteFollow = function (blogId) {
  return function (dispatch) {
    return APIUtil.deleteFollow(blogId).then(
      (currentUser) => dispatch(unfollowBlog(currentUser)),
      (err) => dispatch(receiveFollowErrors(err.responseJSON)),
    );
  };
};

export const fetchFollowers = function (blogId) {
  return function (dispatch) {
    return APIUtil.fetchFollowers(blogId).then(
      (response) => {
        dispatch(receiveFollowers(response));
        // if resolve runs, does not return any value, so only time this promise returns a value is when there is an error
      },
      (err) => dispatch(receiveFollowErrors(err.responseJSON)),
    );
  };
};
