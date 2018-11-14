import { RECEIVE_POST_ERRORS } from '../../actions/post_actions';

const postErrorsReducer = function (state = [], action) {
    switch (action.type) {
        // case RECEIVE_POST_ERRORS: 

        default:
            return state;
    };
};

export default postErrorsReducer;