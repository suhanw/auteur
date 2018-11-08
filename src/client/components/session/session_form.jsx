import React from 'react';
import {renderErrors} from '../../util/error_util';

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
    const emailField = (
      <input className='input-text input-text-default'
        type='text'
        name='email'
        value={this.state.email}
        placeholder='Email'
        onChange={this.handleChange('email')} />
    );
    const passwordField = (
      <input className='input-text input-text-default'
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
        <input className='input-text input-text-default'
          type='text'
          name='username'
          value={this.state.username}
          placeholder='Username'
          onChange={this.handleChange('username')} />
      );
      submitButton = (<input className='btn btn-default btn-blue' type='submit' value='Sign up' />);
    }
    const errorMessage = renderErrors(this.props.errors);

    return (
      <form className='session-form' onSubmit={this.handleSubmit}>
        {this.props.sessionId ? 'You are logged in' : ''}
        {emailField}
        {passwordField}
        {usernameField}
        {errorMessage}
        {submitButton}
      </form>
    );
  }

  handleChange(inputField) {
    const that = this;
    return function(e) {
      e.preventDefault();
      that.setState({[inputField]: e.target.value});
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.submit(user).then(
      () => console.log('success'),
      () => console.log('error')
    );
  }
}

export default SessionForm;
