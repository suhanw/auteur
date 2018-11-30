import { normalize, schema } from 'normalizr';
import { merge, union, mergeWith, isArray } from 'lodash';
import { RECEIVE_POSTS, RECEIVE_POST, REMOVE_POST } from '../../actions/post_actions';
import { RECEIVE_NOTES, RECEIVE_NOTE, REMOVE_NOTE } from '../../actions/note_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';
import { replaceArray } from '../../util/misc_util';

const defaultState = {
    byId: {},
    allIds: [],
};

const userSchema = new schema.Entity('users',
    {},
    { idAttribute: '_id' });

const blogSchema = new schema.Entity('blogs',
    {},
    { idAttribute: '_id', });

const postSchema = new schema.Entity('posts',
    { blog: blogSchema },
    { idAttribute: '_id' });

const noteSchema = new schema.Entity('notes',
    {
        post: postSchema,
        author: userSchema,
    },
    { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;
let postId;
let noteId;

const postsReducer = function (state = defaultState, action) {
    Object.freeze(state);
    let newState = {};
    switch (action.type) {
        case RECEIVE_NOTES:
            payloadSchema = [noteSchema];
            normalizedPayload = normalize(action.payload.notes, payloadSchema);
            let newPost = {
                [action.payload.postId]: {
                    notes: normalizedPayload.result, // this is an array of note ids
                }
            };
            newState.byId = mergeWith(
                {},
                state.byId,
                newPost,
                replaceArray
            );
            newState.allIds = union(
                state.allIds,
                [action.payload.postId]
            );
            return newState;
        case RECEIVE_NOTE:
            noteId = action.payload._id;
            postId = action.payload.post._id;
            normalizedPayload = normalize(action.payload, noteSchema);
            newState.byId = mergeWith(
                {},
                state.byId,
                normalizedPayload.entities.posts,
                replaceArray,
            );
            // insert noteId in the post.notes state
            if (newState.byId[postId].notes) {
                newState.byId[postId].notes.unshift(noteId);
            }
            newState.allIds = union(
                state.allIds,
                [action.payload.post._id]
            );
            return newState;
        case REMOVE_NOTE:
            noteId = action.payload._id;
            postId = action.payload.post._id;
            normalizedPayload = normalize(action.payload, noteSchema);
            newState.byId = mergeWith(
                {},
                state.byId,
                normalizedPayload.entities.posts,
                replaceArray,
            );
            // filter to exclude the removed noteId from the post.notes state
            if (newState.byId[postId].notes) {
                newState.byId[postId].notes = newState.byId[postId].notes.filter((note) => note !== noteId);
            }
            newState.allIds = union(
                state.allIds,
                [action.payload.post._id]
            );
            return newState;
        case RECEIVE_POSTS:
            payloadSchema = [postSchema];
            normalizedPayload = normalize(action.payload, payloadSchema);
            newState.byId = mergeWith(
                {},
                state.byId,
                normalizedPayload.entities.posts,
                replaceArray,
            );
            newState.allIds = union(
                state.allIds,
                action.payload.map((post) => post._id),
            );
            return newState;
        case RECEIVE_POST:
            normalizedPayload = normalize(action.payload, postSchema);
            newState.byId = mergeWith(
                {},
                state.byId,
                normalizedPayload.entities.posts,
                replaceArray,
            );
            if (state.allIds.indexOf(action.payload._id) < 0) {
                newState.allIds = state.allIds.slice();
                // insert latest post into beginning of array
                newState.allIds.unshift(action.payload._id);
            } else {
                // else, the received post might be an updated post
                newState.allIds = union(
                    state.allIds,
                    [action.payload._id]
                );
            }
            return newState;
        case REMOVE_POST:
            postId = action.payload;
            newState.byId = mergeWith({}, state.byId, replaceArray);
            delete newState.byId[postId];
            newState.allIds = state.allIds.slice();
            const indexToDel = newState.allIds.indexOf(postId);
            newState.allIds.splice(indexToDel, 1);
            return newState;
        case REMOVE_CURRENT_USER:
            return defaultState;
        default:
            return state;
    };
};

export default postsReducer;