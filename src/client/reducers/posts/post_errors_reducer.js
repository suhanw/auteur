import { RECEIVE_POST_ERRORS, RECEIVE_POSTS } from '../../actions/post_actions';

const postErrorsReducer = function (state = [], action) {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_POST_ERRORS:
            return action.payload;
        case RECEIVE_POSTS:
            return [];
        default:
            return state;
    };
};

export default postErrorsReducer;