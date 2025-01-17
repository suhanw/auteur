import * as APIUtil from '../util/api_util/search_api_util';
import { receivePosts, receivePostErrors } from './post_actions';
import { receiveUsers, receiveUserErrors } from './user_actions';
import { loadSearchPosts } from '../actions/loading_actions';

export const RECEIVE_TAGS = 'RECEIVE_TAGS';
export const RECEIVE_SEARCH_POSTS = 'RECEIVE_SEARCH_POSTS';
export const RECEIVE_SEARCH_USERS = 'RECEIVE_SEARCH_USERS';
export const CLEAR_SEARCH_POSTS = 'CLEAR_SEARCH_POSTS';
export const RECEIVE_TAG_ERRORS = 'RECEIVE_TAG_ERRORS';

export const receiveTags = function (tags) {
  return {
    type: RECEIVE_TAGS,
    payload: tags,
  };
};

export const receiveSearchPosts = function (searchPosts) {
  return {
    type: RECEIVE_SEARCH_POSTS,
    payload: searchPosts,
  };
};

export const receiveSearchUsers = function (searchUsers) {
  return {
    type: RECEIVE_SEARCH_USERS,
    payload: searchUsers,
  };
};

export const clearSearchPosts = function () {
  return {
    type: CLEAR_SEARCH_POSTS,
  };
};

export const receiveTagErrors = function (errors) {
  return {
    type: RECEIVE_TAG_ERRORS,
    payload: errors,
  };
};


export const fetchTags = function (tagQuery) {
  return function (dispatch) {
    return APIUtil.fetchTags(tagQuery).then(
      (tags) => dispatch(receiveTags(tags)),
      (err) => dispatch(receiveTagErrors(err.responseJSON))
    );
  };
};

export const fetchSearchPosts = function (tagQuery) {
  return function (dispatch) {
    dispatch(loadSearchPosts());
    return APIUtil.fetchSearchPosts(tagQuery).then(
      (searchPosts) => {
        dispatch(receiveSearchPosts(searchPosts)); // to add post Ids to UI state for rendering
        dispatch(receivePosts(searchPosts));
        return searchPosts;
      },
      (err) => dispatch(receivePostErrors(err.responseJSON))
    );
  };
};

export const fetchSearchUsers = function (userQuery) {
  return function (dispatch) {
    return APIUtil.fetchSearchUsers(userQuery).then(
      (searchUsers) => {
        dispatch(receiveSearchUsers(searchUsers));
        dispatch(receiveUsers(searchUsers));
      },
      (err) => dispatch(receiveUserErrors(err.responseJSON))
    );
  };
};