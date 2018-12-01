import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

import './public/stylesheets/styles.scss'; // to use SASS compiled by webpack


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

  // TESTING===========================
  window.getState = store.getState;
  window.dispatch = store.dispatch;
  // TESTING===========================
});

// TESTING===========================


// TESTING===========================