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
        <div>Search bar</div>
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
    let buttonsToRender;
    if (currentUser) {
      buttonsToRender = (
        <button onClick={this.handleClick} className='btn btn-default btn-blue'>Logout</button>
      );
    } else if (pathname === '/signup'){
      buttonsToRender = (
          <li className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>
      );
    } else if (pathname === '/login') {
      buttonsToRender = (
          <li className='btn btn-default btn-white'>
            <Link to='/signup'>Sign up</Link>
          </li>
      );
    } else {
      buttonsToRender = [
          (<li className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>),
          (<li className='btn btn-default btn-white'>
            <Link to='/signup'>Sign up</Link>
          </li>)
      ];
    }
    return (
      <ul className='navbar-right'>
        {buttonsToRender}
      </ul>
    );
  }
}

export default Navbar;
