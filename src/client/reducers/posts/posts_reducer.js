import { RECEIVE_POSTS, RECEIVE_POST_ERRORS } from '../../actions/post_actions';

const defaultState = {
    byId: {},
    allIds: [],
};

const postsReducer = function (state = defaultState, action) {
    switch (action.type) {
        // case RECEIVE_POSTS:

        default:
            return state;
    };
};

export default postsReducer;