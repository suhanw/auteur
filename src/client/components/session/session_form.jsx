import React from 'react';

class SessionForm extends React.Component {
  constructor(prop) {
    super(props);

    this.state = this.props.user;

  }

  render() {

    return (
      <form>
        <input type='text' name='email' value={this.state.email}
      </form>
    );
  }

}

export default SessionForm;
