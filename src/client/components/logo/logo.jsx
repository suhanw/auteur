import React from 'react';
import { Link } from 'react-router-dom';

class Logo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Link to='/dashboard' className='logo'>a</Link>
    );
  }
}

export default Logo;