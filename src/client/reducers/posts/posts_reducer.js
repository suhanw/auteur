import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_POSTS, RECEIVE_POST } from '../../actions/post_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
    byId: {},
    allIds: [],
};

const blogSchema = new schema.Entity('blogs',
    {},
    { idAttribute: '_id', });

const postSchema = new schema.Entity('posts',
    { blog: blogSchema },
    { idAttribute: '_id' });

const postsReducer = function (state = defaultState, action) {
    Object.freeze(state);
    let payloadSchema;
    let normalizedPayload;
    let newState = {};
    switch (action.type) {
        case RECEIVE_POSTS:
            payloadSchema = [postSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
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
        case RECEIVE_POST:
            normalizedPayload = normalize(action.payload, postSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.posts,
            );
            if (state.allIds.indexOf(action.payload._id) < 0) {
                // if post is newly created, insert into beginning of array
                newState.allIds = union({}, state.allIds);
                newState.allIds.unshift(action.payload._id);
            } else {
                // else, the received post might be an updated post
                newState.allIds = union(
                    {},
                    state.allIds,
                    [action.payload._id]
                );
            }
            return newState;
        case REMOVE_CURRENT_USER:
            return defaultState;
        default:
            return state;
    };
};

export default postsReducer;