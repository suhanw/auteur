import React from 'react';

import Logo from '../logo/logo';
import Searchbar from '../searchbar/searchbar';
import AccountPopover from '../popovers/account_popover';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.dynamicClosePopover = this.dynamicClosePopover.bind(this);
    this.renderAccountIcon = this.renderAccountIcon.bind(this);
  }

  render() {

    return (
      <nav className='navbar'>

        <div className='navbar-left'>
          <Logo />
          <Searchbar />
        </div>

        <ul className='navbar-right'>
          <li className='navbar-right-item'><i className="fas fa-home"></i></li>
          <li className='navbar-right-item'><i className="fas fa-comment-alt"></i></li>
          <li className='navbar-right-item'><i className="fas fa-bell"></i></li>
          {this.renderAccountIcon()}
          <li className='navbar-right-item'><i className="fas fa-pen-square"></i></li>
          <li onClick={this.props.confirmLogout}>Logout</li>
        </ul>

      </nav>
    );
  }

  componentDidMount() {
    // clicking anywhere else on the window should close any/all popovers
    window.addEventListener('click', this.dynamicClosePopover);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.dynamicClosePopover);
  }

  dynamicClosePopover() {
    const { popover, closePopover } = this.props;
    if (popover) { // only dispatch closePopover if there is an open popover
      closePopover();
    }
  }

  renderAccountIcon() {

    return (
      <li className='navbar-right-item'>
        <i className="fas fa-user"></i>
        <AccountPopover />
      </li>
    );
  }
}

export default Navbar;