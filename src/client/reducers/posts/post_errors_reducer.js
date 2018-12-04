import { CLEAR_ERRORS } from '../../actions/clear_actions';
import { RECEIVE_POST_ERRORS, RECEIVE_POSTS, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';

const postErrorsReducer = function (state = [], action) {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_POST_ERRORS:
            return action.payload;
        case RECEIVE_POSTS:
            return [];
        case RECEIVE_POST:
            return [];
        case REMOVE_POST:
            return [];
        case CLEAR_ERRORS:
            return [];
        default:
            return state;
    };
};

export default postErrorsReducer;