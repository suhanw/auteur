import * as APIUtil from '../util/api_util/user_api_util';
import { loadPostIndex } from '../actions/loading_actions';
import { receiveBlogs } from '../actions/blog_actions';
import { receivePosts } from '../actions/post_actions';

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
      (userLikes) => {
        if (queryParams && queryParams.populate) dispatch(receivePosts(userLikes.posts));
        dispatch(receiveUserLikes(userLikes));
      },
      (err) => dispatch(receiveUserErrors(err.responseJSON))
    );
  };
};

export const fetchUserFollowing = function (userId, queryParams = null) {
  return function (dispatch) {
    if (!queryParams) dispatch(loadPostIndex()); // render spinner only when fetching posts, not blogs
    return APIUtil.fetchUserFollowing(userId, queryParams).then(
      (response) => {
        if (queryParams && queryParams.entity === 'blogs') {
          dispatch(receiveBlogs(response));
        } else {
          dispatch(receivePosts(response));
          dispatch(receiveUserFollowing(response));
        }
      },
      (err) => dispatch(receiveUserErrors(err.responseJSON))
    );
  };
};