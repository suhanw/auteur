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

  window.dashboard_content = document.querySelector('.dashboard');
  // dashboard_content.addEventListener('scroll', (e) => {
  //   // console.log('document.body.scrollTop', document.body.scrollTop);
  //   // console.log('window.scrollY', window.scrollY);
  //   // console.log('window.pageYOffset', window.pageYOffset);
  //   // console.log('document.documentElement.scrollTop', document.documentElement.scrollTop);
  //   // console.log('window.innerHeight', window.innerHeight);
  //   console.log('dashboard_content.offsetHeight', dashboard_content.offsetHeight);
  //   console.log('dashboard_content.offsetTop', dashboard_content.offsetTop);
  //   console.log('dashboard_content.clientHeight', dashboard_content.clientHeight);
  //   console.log('dashboard_content.clientTop', dashboard_content.clientTop);
  //   console.log('dashboard_content.scrollTop', dashboard_content.scrollTop);
  // });
  // TESTING===========================
});

// TESTING===========================
// import {signup, login, logout} from './util/session_api_util';
// import {signup, login, logout} from './actions/session_actions';
// import * as APIUtil from './util/post_api_util';
// import { fetchPosts } from './actions/post_actions';
// import { fetchBlog } from './util/blog_api_util';
// import { fetchBlog } from './actions/blog_actions';

// window.fetchBlog = fetchBlog;
// window.fetchPosts = fetchPosts;
// window.fetchPosts = APIUtil.fetchPosts;
// window.signup = signup;
// window.login = login;
// window.logout = logout;

// TESTING===========================