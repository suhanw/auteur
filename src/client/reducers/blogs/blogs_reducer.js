import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_POSTS } from '../../actions/post_actions';

const defaultState = {
    byId: {},
    allIds: [],
};

const blogsReducer = function (state = defaultState, action) {
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
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                Object.keys(normalizedPayload.entities.blogs),
            );
            return newState;
        default:
            return state;
    };
};

export default blogsReducer;