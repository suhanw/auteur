import * as APIUtil from '../util/api_util/search_api_util';

export const RECEIVE_TAGS = 'RECEIVE_TAGS';
export const RECEIVE_TAG_ERRORS = 'RECEIVE_TAG_ERRORS';

export const receiveTags = function (tags) {
  return {
    type: RECEIVE_TAGS,
    payload: tags,
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