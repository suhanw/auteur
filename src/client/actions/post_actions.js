import * as APIUtil from '../util/post_api_util';
import { fetchBlog } from '../actions/blog_actions';
import { receivePostSubmit } from '../actions/loading_actions';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RECEIVE_POST = 'RECEIVE_POST';
export const REMOVE_POST = 'REMOVE_POST';
export const CONFIRM_DELETE_POST = 'CONFIRM_DELETE_POST';
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

export const removePost = function (postId) {
    return {
        type: REMOVE_POST,
        payload: postId,
    };
};

export const receivePostErrors = function (errors) {
    return {
        type: RECEIVE_POST_ERRORS,
        payload: errors,
    };
};

export const fetchFeed = function () {
    return function (dispatch) {
        return APIUtil.fetchFeed().then(
            (posts) => dispatch(receivePosts(posts)),
            (err) => dispatch(receivePostErrors(err.responseJSON)),
        );
    };
};

export const createPost = function (post) {
    return function (dispatch) {
        dispatch(receivePostSubmit()); // to render loading spinner
        return APIUtil.createPost(post).then(
            (createdPost) => {
                dispatch(fetchBlog(createdPost.blog));
                dispatch(receivePost(createdPost));
            },
            (err) => dispatch(receivePostErrors(err.responseJSON)),
        );
    };
};

export const confirmDeletePost = function (post) {
    return {
        type: CONFIRM_DELETE_POST,
        payload: {
            action: 'confirmDeletePost',
            data: post,
        },
    };
};

export const deletePost = function (post) {
    return function (dispatch) {
        return APIUtil.deletePost(post).then(
            (postId) => {
                dispatch(fetchBlog(post.blog));
                dispatch(removePost(postId));
            },
            (err) => dispatch(receivePostErrors(err.responseJSON))
        );
    };
};

export const updatePost = function (post) {
    return function (dispatch) {
        dispatch(receivePostSubmit()); // to render loading spinner
        return APIUtil.updatePost(post).then(
            (updatedPost) => dispatch(receivePost(updatedPost)),
            (err) => dispatch(receivePostErrors(err.responseJSON))
        );
    };
};

