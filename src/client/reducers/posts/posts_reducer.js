import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_POSTS, RECEIVE_POST_ERRORS } from '../../actions/post_actions';

const defaultState = {
    byId: {},
    allIds: [],
};

const postsReducer = function (state = defaultState, action) {
    let newState = {};
    switch (action.type) {
        case RECEIVE_POSTS:
            const blogSchema = new schema.Entity('blogs',
                {},
                { idAttribute: '_id', });
            const postSchema = new schema.Entity('posts',
                { blog: blogSchema },
                { idAttribute: '_id' });
            const payloadSchema = [postSchema];
            const normalizedPayload = normalize(action.payload, payloadSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.posts,
            );
            newState.allIds = union(
                state.allIds,
                action.payload.map((post) => post._id),
            );
            return newState;
        default:
            return state;
    };
};

export default postsReducer;