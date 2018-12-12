import React from 'react';
import { NavLink } from 'react-router-dom';

import Logo from '../logo/logo';
import Searchbar from '../search/search_bar';
import AccountPopover from '../popovers/account_popover';
import ChatPopover from '../popovers/chat_popover';
import NotificationPopover from '../popovers/notification_popover';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.dynamicClosePopover = this.dynamicClosePopover.bind(this);
    this.renderHomeIcon = this.renderHomeIcon.bind(this);
    this.renderAccountIcon = this.renderAccountIcon.bind(this);
    this.renderChatIcon = this.renderChatIcon.bind(this);
    this.renderNotificationIcon = this.renderNotificationIcon.bind(this);
    this.renderPostIcon = this.renderPostIcon.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
  }

  render() {
    const { popover, openPopover, closePopover } = this.props;
    return (
      <nav className='navbar'>

        <div className='navbar-left'>
          <Logo />
          <Searchbar
            popover={popover}
            openPopover={openPopover}
            closePopover={closePopover} />
        </div>

        <ul className='navbar-right'>
          {this.renderHomeIcon()}
          {this.renderChatIcon()}
          {this.renderNotificationIcon()}
          {this.renderAccountIcon()}
          {this.renderPostIcon()}
        </ul>

      </nav>
    );
  }

  componentDidMount() {
    // clicking anywhere else on the window should close any/all popovers
    window.addEventListener('click', this.dynamicClosePopover);
    window.addEventListener('keydown', this.dynamicClosePopover);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.dynamicClosePopover);
    window.removeEventListener('keydown', this.dynamicClosePopover);
  }

  dynamicClosePopover(e) {
    e.stopPropagation();
    if (e.type === 'keydown' && e.key !== 'Escape') return; // do nothing when user hits a key other than Esc
    const { popover, closePopover } = this.props;
    if (popover) { // only dispatch closePopover if there is an open popover
      closePopover();
    }
  }

  renderHomeIcon() {
    return (
      <li className='navbar-right-item'>
        <NavLink exact to='/dashboard'>
          <i className="fas fa-home"></i>
        </NavLink>
      </li>
    );
  }

  renderChatIcon() {
    const { popover } = this.props;
    const chatPopover = {
      popoverId: 'chatPopover',
      popoverType: 'chatPopover',
    };
    let popoverStyle = { display: 'none' };
    let activeIcon = null;
    if (JSON.stringify(popover) === JSON.stringify(chatPopover)) {
      popoverStyle = { display: 'inline-block' };
      activeIcon = { color: 'white' };
    }
    return (
      <li className='navbar-right-item' onClick={this.togglePopover(chatPopover)}>
        <i className="fas fa-comment-alt" style={activeIcon}></i>
        <ChatPopover
          popoverStyle={popoverStyle} />
      </li>
    );
  }

  renderNotificationIcon() {
    const { popover } = this.props;
    const notificationPopover = {
      popoverId: 'notificationPopover',
      popoverType: 'notificationPopover',
    };
    let popoverStyle = { display: 'none' };
    let activeIcon = null;
    if (JSON.stringify(popover) === JSON.stringify(notificationPopover)) {
      popoverStyle = { display: 'inline-block' };
      activeIcon = { color: 'white' };
    }
    return (
      <li className='navbar-right-item' onClick={this.togglePopover(notificationPopover)}>
        <i className="fas fa-bell" style={activeIcon}></i>
        <NotificationPopover
          popoverStyle={popoverStyle} />
      </li>
    );
  }

  renderAccountIcon() {
    const { currentUser, blog, popover, confirmLogout } = this.props;
    const accountPopover = {
      popoverId: 'accountPopover',
      popoverType: 'accountPopover',
    };
    let popoverStyle = { display: 'none' };
    let activeIcon = null;
    if (JSON.stringify(popover) === JSON.stringify(accountPopover)) {
      popoverStyle = { display: 'inline-block' };
      activeIcon = { color: 'white' };
    }
    return (
      <li className='navbar-right-item' >
        <NavLink to='/settings'>
          <i className="fas fa-user" style={activeIcon}
            onClick={this.togglePopover(accountPopover)}></i>
        </NavLink>
        <AccountPopover
          popoverStyle={popoverStyle}
          confirmLogout={confirmLogout}
          currentUser={currentUser}
          blog={blog} />
      </li>
    );
  }

  renderPostIcon() {
    const { choosePostType } = this.props;
    return (
      <li className='navbar-right-item' onClick={choosePostType}>
        <i className="fas fa-pen-square"></i>
      </li>
    );
  }

  togglePopover(currPopover) {
    const { popover, openPopover, closePopover } = this.props;
    return function (e) {
      e.preventDefault(); // to avoid navigating to new page when clicking on a tag
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