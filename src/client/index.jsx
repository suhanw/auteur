import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

import './public/stylesheets/styles.scss'; // to use SASS compiled by webpack

document.addEventListener('DOMContentLoaded', function() {
  const store = configureStore();


  // TESTING===========================
  window.getState = store.getState;
  window.dispatch = store.dispatch;
  // TESTING===========================

  const rootDOM = document.querySelector('#root');
  ReactDOM.render(<Root store={store}/>, rootDOM);
});

// TESTING===========================
// import {signup, login, logout} from './util/session_api_util';
import {signup, login, logout} from './actions/session_actions';

// window.signup = signup;
window.login = login;
window.logout = logout;
// TESTING===========================
