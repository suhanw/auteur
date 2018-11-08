import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  render() {

    return(
      <nav className='navbar'>
        {this.renderButtons()}
      </nav>
    );
  }

  handleClick(e) {
    e.preventDefault();
    const {logout} = this.props;
    logout();
  }

  renderButtons() {
    const {currentUser} = this.props;
    const {pathname} = this.props.location;
    if (currentUser) { 
      return (
        <button onClick={this.handleClick} className='btn btn-default btn-blue'>Logout</button>
      );
    } else if (pathname === '/signup'){
      return (
        <ul className='session-btn-group'>
          <li className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>
        </ul>
      );
    } else if (pathname === '/login') {
      return (
        <ul className='session-btn-group'>
          <li className='btn btn-default btn-white'>
            <Link to='/signup'>Sign up</Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className='session-btn-group'>
          <li className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>
          <li className='btn btn-default btn-white'>
            <Link to='/signup'>Sign up</Link>
          </li>
        </ul>
      );

    }
  }
}

export default Navbar;
