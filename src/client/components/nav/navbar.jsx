import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
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

  logout(e) {
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
        <button onClick={this.logout} className='btn btn-default btn-blue'>Logout</button>
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
          (<li key='login' className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>),
          (<li key='signup' className='btn btn-default btn-white'>
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

  reloadCarousel(path) {
    const that = this;
    return function(e) {
      e.preventDefault();
      that.prop.history.replace()
    }
  }

  componentWillMount() {
    
  }


}

export default Navbar;
