import React from 'react';
import { Link } from 'react-router-dom';
import { renderErrors } from '../../util/error_util';

class SessionForm extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      email: '',
      username: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    if (this.props.match.path === '/') {
      return (
        <ul className='session-form get-started'>
          <Link to='/signup' className='btn btn-default btn-blue'>
            <li>
              Get Started
            </li>
          </Link>
          <Link to='/login' className='btn btn-default btn-white'>
            <li>
              Log In
            </li>
          </Link>
        </ul>
      );
    }
    const emailField = (
      <input className='input-text input-text-default swipe-left'
        type='text'
        name='email'
        value={this.state.email}
        placeholder='Email'
        onChange={this.handleChange('email')} />
    );
    const passwordField = (
      <input className='input-text input-text-default swipe-left'
        type='password'
        name='password'
        value={this.state.password}
        placeholder='Password'
        onChange={this.handleChange('password')} />
    );
    let usernameField = null;
    let submitButton = (<input className='btn btn-default btn-blue' type='submit' value='Log in' />);
    if (this.props.path === '/signup') {
      usernameField = (
        <input className='input-text input-text-default swipe-left'
          type='text'
          name='username'
          value={this.state.username}
          placeholder='Username'
          onChange={this.handleChange('username')} />
      );
      submitButton = (<input className='btn btn-default btn-blue slide-down' type='submit' value='Sign up' />);
    }
    const errorMessage = renderErrors(this.props.errors);

    return (
      <form className='session-form' onSubmit={this.handleSubmit}>
        {emailField}
        {passwordField}
        {usernameField}
        {errorMessage}
        <div className='slide-down-container'>
          {submitButton}
        </div>
      </form>
    );
  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      e.preventDefault();
      that.setState({ [inputField]: e.target.value });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.submit(user).then(
      () => {
        // if no error in redux state, clear fields
        // else, clear password field
      }
    );
  }

  componentDidMount() {
    const emailField = document.querySelector('.intro-slide input[name="email"]');
    if (emailField) {
      // focus on email field after animation
      setTimeout(
        () => emailField.focus(),
        500
      );
    }
    // debugger
  }
}

export default SessionForm;
