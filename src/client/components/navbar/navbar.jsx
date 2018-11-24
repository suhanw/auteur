import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../logo/logo';
import Searchbar from '../searchbar/searchbar';
import AccountPopover from '../popovers/account_popover';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.dynamicClosePopover = this.dynamicClosePopover.bind(this);
    this.renderHomeIcon = this.renderHomeIcon.bind(this);
    this.renderAccountIcon = this.renderAccountIcon.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
  }

  render() {
    return (
      <nav className='navbar'>

        <div className='navbar-left'>
          <Logo />
          <Searchbar />
        </div>

        <ul className='navbar-right'>
          {this.renderHomeIcon()}
          <li className='navbar-right-item'><i className="fas fa-comment-alt"></i></li>
          <li className='navbar-right-item'><i className="fas fa-bell"></i></li>
          {this.renderAccountIcon()}
          <li className='navbar-right-item'><i className="fas fa-pen-square"></i></li>
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

  renderHomeIcon() {
    const { pathname } = this.props;
    const activeIcon = pathname === '/dashboard' ? { color: 'white' } : null;
    return (
      <Link to='/dashboard'>
        <li className='navbar-right-item'>
          <i className="fas fa-home" style={activeIcon}></i>
        </li>
      </Link>
    );
  }

  renderAccountIcon() {
    const { currentUser, blog, popover, confirmLogout } = this.props;
    const accountPopover = {
      popoverId: 'accountPopover',
      popoverType: 'accountPopover',
    };
    const popoverStyle = JSON.stringify(popover) === JSON.stringify(accountPopover) ? { display: 'inline-block' } : { display: 'none' };
    const activeIcon = JSON.stringify(popover) === JSON.stringify(accountPopover) ? { color: 'white' } : null;
    return (
      <li className='navbar-right-item' onClick={this.togglePopover(accountPopover)}>
        <i className="fas fa-user" style={activeIcon}></i>
        <AccountPopover
          popoverStyle={popoverStyle}
          confirmLogout={confirmLogout}
          currentUser={currentUser}
          blog={blog} />
      </li>
    );
  }

  togglePopover(currPopover) {
    const { popover, openPopover, closePopover } = this.props;
    return function (e) {
      e.stopPropagation(); // to avoid bubbling up to window handler which will close any popovers
      if (JSON.stringify(popover) === JSON.stringify(currPopover)) {
        closePopover(); // if current popover is open, then close popover
      } else {
        openPopover(currPopover); // otherwise open current popover (which will auto close any other open popover)
      }
    };
  }
}

export default Navbar;