import * as APIUtil from '../util/post_api_util';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RECEIVE_POST = 'RECEIVE_POST';
export const RECEIVE_POST_ERRORS = 'RECEIVE_POST_ERRORS';

export const receivePosts = function (posts) {
    return {
        type: RECEIVE_POSTS,
        payload: posts,
    };
};

export const receivePost = function (post) {
    return {
        type: RECEIVE_POST,
        payload: post,
    };
};

export const receivePostErrors = function (errors) {
    return {
        type: RECEIVE_POST_ERRORS,
        payload: errors,
    };
};

export const fetchPosts = function () {
    return function (dispatch) {
        return APIUtil.fetchPosts().then(
            (posts) => dispatch(receivePosts(posts)),
            (err) => dispatch(receivePostErrors(err.responseJSON)),
        );
    };
};

export const createPost = function (post) {
    return function (dispatch) {
        return APIUtil.createPost(post).then(
            (createdPost) => dispatch(receivePost(createdPost)),
            (err) => dispatch(receivePostErrors(err.responseJSON)),
        );
    };
};

