import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

import './public/stylesheets/main.scss'; // to use SASS compiled by webpack


document.addEventListener('DOMContentLoaded', function () {
  let store;
  if (window.currentUser) {
    const preloadedState = {
      entities: {
        users: {
          byId: {
            [window.currentUser._id]: window.currentUser,
          },
          allIds: [window.currentUser._id],
        }
      },
      session: {
        id: window.currentUser._id,
      }
    }
    delete window.currentUser;
    store = configureStore(preloadedState);
  } else {
    store = configureStore();
  }

  const rootDOM = document.querySelector('#root');
  ReactDOM.render(<Root store={store} />, rootDOM);

  // REMOVE IN PROD
  window.dispatch = store.dispatch;
  // REMOVE IN PROD

});

// REMOVE IN PROD
// import { createChatRoom } from './util/api_util/chat_api_util';
import { createChatRoom } from './actions/chat_actions';
window.createChatRoom = createChatRoom;
// REMOVE IN PROD
