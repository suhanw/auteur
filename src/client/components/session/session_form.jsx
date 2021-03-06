import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage } from '../errors/errors';

class SessionForm extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      email: '',
      username: '',
      password: '',
    };

    this.emailFieldRef = React.createRef();
    this.demoLoginTimer = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    if (this.props.path === '/') {
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
          <li className='demo-link'>
            <Link to='/login/demo'>
              Click here for demo
            </Link>
          </li>
        </ul >
      );
    }
    const emailField = (
      <input className='input-text input-text-default swipe-left'
        type='text'
        name='email'
        value={this.state.email}
        placeholder='Email'
        ref={this.emailFieldRef}
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

    return (
      <form className='session-form' onSubmit={this.handleSubmit}>
        {emailField}
        {passwordField}
        {usernameField}
        {/* {errorMessage} */}
        <ErrorMessage errorArr={this.props.errors} />
        <div className='slide-down-container'>
          {submitButton}
          <span className='demo-link object-fade-in'>
            <Link to='/login/demo'>
              Click here for demo
            </Link>
          </span>
        </div>
      </form>
    );
  }

  componentDidMount() {
    if (this.props.errors.length > 0) this.props.clearErrors();

    if (this.emailFieldRef.current) { // null on the get started page
      // focus on email field after animation
      let emailFieldTimer = setTimeout(
        () => {
          clearTimeout(emailFieldTimer);
          this.emailFieldRef.current.focus();
        },
        500
      );
    }

    // demo login
    if (this.props.pathname.includes('demo')) {
      this.demoLoginTimer = setTimeout( // start after animation
        () => this.renderDemoEmail('denzel@washington.com'.split('')),
        500,
      );
    }
  }

  componentWillReceiveProps(newProps) { // when user clicks on demo on login page AND the login rendering hasn't started yet
    if (newProps.pathname.includes('demo')) {
      this.demoLoginTimer = setTimeout(
        () => this.renderDemoEmail('denzel@washington.com'.split('')),
        500,
      );
    }
  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      e.preventDefault();
      that.setState({ [inputField]: e.target.value });
    };
  }

  handleSubmit(e) {
    // TODO: render something that says logging in
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.submit(user);
  }

  renderDemoEmail(email) {
    clearTimeout(this.demoLoginTimer);
    this.demoLoginTimer = 0;
    if (!email.length) {
      this.renderDemoPassword('password'.split(''));
      return;
    }
    let newEmail = this.state.email + email.shift();
    this.setState({ email: newEmail }, () => {
      this.demoLoginTimer = setTimeout(() => this.renderDemoEmail(email), 50);
    });
  }

  renderDemoPassword(password) {
    clearTimeout(this.demoLoginTimer);
    this.demoLoginTimer = 0;
    if (!password.length) {
      this.demoLogin();
      return;
    }
    let newPassword = this.state.password + password.shift();
    this.setState({ password: newPassword }, () => {
      this.demoLoginTimer = setTimeout(() => this.renderDemoPassword(password), 50);
    });
  }

  demoLogin() {
    this.props.submit({
      email: 'denzel@washington.com',
      password: 'testing',
    });
  }
}

export default SessionForm;
