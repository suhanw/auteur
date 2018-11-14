import * as APIUtil from '../util/user_api_util';

export const RECEIVE_USER_FEED = 'RECEIVE_USER_FEED';
export const RECEIVE_USER_ERRORS = 'RECEIVE_USER_ERRORS';

export const receiveUserFeed = function (feed) {
    return {
        type: RECEIVE_USER_FEED,
        payload: feed,
    };
};

export const receiveUserErrors = function (errors) {
    return {
        type: RECEIVE_USER_ERRORS,
        payload: errors,
    };
};

export const fetchUserFeed = function (userId) {
    return function (dispatch) {
        return APIUtil.fetchUserFeed(userId).then(
            (userFeed) => dispatch(receiveUserFeed(userFeed)),
            (err) => dispatch(receiveUserErrors(err)),
        );
    };
};