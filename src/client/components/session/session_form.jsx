import React from 'react';

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
      <input
        type='text'
        name='email'
        value={this.state.email}
        placeholder='Email'
        onChange={this.handleChange('email')} />
    );
    const passwordField = (
      <input
        type='password'
        name='password'
        value={this.state.password}
        placeholder='Password'
        onChange={this.handleChange('password')} />
    );
    let usernameField = null;
    let submitButton = (<input type='submit' value='Log in' />);
    if (this.props.path === '/signup') {
      usernameField = (
        <input
          type='text'
          name='username'
          value={this.state.username}
          placeholder='Username'
          onChange={this.handleChange('username')} />
      );
      submitButton = (<input type='submit' value='Sign up' />);
    }

    return (
      <form className='session-form' onSubmit={this.handleSubmit}>
        {emailField}
        {passwordField}
        {usernameField}
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
    this.props.submit(this.state);
  }
}

export default SessionForm;
