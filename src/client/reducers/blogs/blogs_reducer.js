import { normalize, schema } from 'normalizr';
import { merge, union } from 'lodash';
import { RECEIVE_POSTS } from '../../actions/post_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { RECEIVE_BLOG } from '../../actions/blog_actions';
import { RECEIVE_USERS, RECEIVE_USER_FOLLOWING } from '../../actions/user_actions';

const defaultState = {
    byId: {},
    allIds: [],
};

const userSchema = new schema.Entity(
    'users',
    {
        primaryBlog: new schema.Entity(
            'blogs',
            { author: userSchema },
            { idAttribute: '_id' }
        )
    },
    { idAttribute: '_id' }
);

const blogSchema = new schema.Entity(
    'blogs',
    { author: userSchema },
    { idAttribute: '_id' }
);

const postSchema = new schema.Entity('posts',
    { blog: blogSchema },
    { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;


const blogsReducer = function (state = defaultState, action) {
    Object.freeze(state);
    let newState = {};
    let blogIdsArr = [];
    switch (action.type) {
        case RECEIVE_USER_FOLLOWING:
            payloadSchema = [postSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            if (action.payload.length > 0) {
                blogIdsArr = Object.keys(normalizedPayload.entities.blogs);
            }
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                blogIdsArr,
            );
        case RECEIVE_POSTS:
            payloadSchema = [postSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            if (action.payload.length > 0) {
                blogIdsArr = Object.keys(normalizedPayload.entities.blogs);
            }
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                blogIdsArr,
            );
            return newState;
        case RECEIVE_BLOG:
            normalizedPayload = normalize(action.payload, blogSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                [action.payload._id]
            );
            return newState;
        case RECEIVE_USERS:
            payloadSchema = [userSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            newState.byId = merge(
                {},
                state.byId,
                normalizedPayload.entities.blogs,
            );
            newState.allIds = union(
                state.allIds,
                Object.keys(normalizedPayload.entities.blogs)
            );
            return newState;
        case REMOVE_CURRENT_USER:
            return defaultState;
        default:
            return state;
    };
};

export default blogsReducer;