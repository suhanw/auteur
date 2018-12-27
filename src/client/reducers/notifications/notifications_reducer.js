import { normalize, schema } from 'normalizr';
import { merge } from 'lodash';

import { RECEIVE_UNREAD_NOTIFICATION_COUNT, RECEIVE_NOTIFICATIONS } from '../../actions/notification_actions';
import { REMOVE_CURRENT_USER } from '../../actions/session_actions';

const defaultState = {
  unreadCount: 0,
  byId: {},
  allIds: [],
};

const userSchema = new schema.Entity('users',
  {},
  { idAttribute: '_id' });

const postSchema = new schema.Entity('posts',
  {},
  { idAttribute: '_id' });

const noteSchema = new schema.Entity('notes',
  {
    post: postSchema,
    author: userSchema,
  },
  { idAttribute: '_id' });

let payloadSchema;
let normalizedPayload;

const notificationsReducer = function (state = defaultState, action) {
  Object.freeze(state);
  let newState;
  switch (action.type) {
    case RECEIVE_UNREAD_NOTIFICATION_COUNT:
      newState = merge({}, state);
      newState.unreadCount = action.payload;
      return newState;
    // case RECEIVE_NOTIFICATIONS:
    //   newState = merge({}, state);

    case REMOVE_CURRENT_USER:
      return defaultState;
    default:
      return state;
  }
};

export default notificationsReducer;