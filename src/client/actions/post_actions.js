import * as APIUtil from '../util/post_api_util';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export const receivePosts = function (posts) {
    return {
        type: RECEIVE_POSTS,
        posts,
    };
};

export const receivePostErrors = function (errors) {
    return {
        type: RECEIVE_POST_ERRORS,
        errors,
    }
}

export const fetchPosts = function () {
    return function (dispatch) {
        return APIUtil.fetchPosts().then(
            (posts) => dispatch(receivePosts(posts)),
            (err) => dispatch(receivePostErrors(err.responseJSON)),
        );
    }
}