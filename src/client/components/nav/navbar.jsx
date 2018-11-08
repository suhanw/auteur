import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {

    return(
      <nav className='navbar'>
        <Link to='/login' className='btn btn-regular btn-transparent'>Login</Link>
        <Link to='/signup' className='btn btn-regular btn-white'>Sign up</Link>
        <button onClick={this.handleClick} className='btn btn-regular btn-blue'>Logout</button>
      </nav>
    );
  }

  handleClick(e) {
    e.preventDefault();
    const {logout} = this.props;
    logout();
  }
}

export default Navbar;
