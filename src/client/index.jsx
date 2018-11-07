import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function() {
  const rootDOM = document.querySelector('#root');
  ReactDOM.render((
    <h1>
      {window.currentUser ? 'welcome back sir' : 'not logged in'}
    </h1>
  ), rootDOM);
});

// TESTING===========================
import {signup, login, logout} from './util/api_util';

window.signup = signup;
window.login = login;
window.logout = logout;
// TESTING===========================
