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
// import {signup, login, logout} from './util/session_api_util';
// import {signup, login, logout} from './actions/session_actions';
// import * as APIUtil from './util/post_api_util';
// import { fetchPosts } from './actions/post_actions';
// import { fetchBlog } from './util/blog_api_util';
// import { fetchBlog } from './actions/blog_actions';
// import { createPost, updatePost } from './util/post_api_util';
// import { updatePost, deletePost } from './actions/post_actions';
// import { createFollow, deleteFollow, fetchFollowers } from './actions/follow_actions';
import { createNote, deleteNote, fetchNotes, checkUserLikePost } from './util/note_api_util';
// import { createNote, deleteNote } from './actions/note_actions';

window.fetchNotes = fetchNotes;
window.checkUserLikePost = checkUserLikePost;
// window.deleteNote = deleteNote;
// window.createFollow = createFollow;
// window.deleteFollow = deleteFollow;
// window.fetchFollowers = fetchFollowers;
// window.updatePost = updatePost;
// window.deletePost = deletePost;
// window.fetchBlog = fetchBlog;
// window.fetchPosts = fetchPosts;
// window.fetchPosts = APIUtil.fetchPosts;
// window.signup = signup;
// window.login = login;
// window.logout = logout;

// TESTING===========================