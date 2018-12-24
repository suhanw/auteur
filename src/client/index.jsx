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
// import { fetchChatMessage, createChatMessage } from './util/api_util/chat_api_util';
// import { fetchChatMessage, createChatMessage } from './actions/chat_actions';
// import { fetchSearchUsers } from './actions/search_actions';

// window.fetchSearchUsers = fetchSearchUsers;
// window.fetchChatMessage = fetchChatMessage;
// window.createChatMessage = createChatMessage;
// REMOVE IN PROD
