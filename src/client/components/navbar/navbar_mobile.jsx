import React from 'react';

import NavbarMobileMenu from './navbar_mobile_menu';
import Logo from '../logo/logo';
import { toggleClass } from '../../util/misc_util';

class NavbarMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIcon: null,
    };

    this.renderHamburger = this.renderHamburger.bind(this);
    this.toggleHamburger = this.toggleHamburger.bind(this);
    this.renderMobileMenu = this.renderMobileMenu.bind(this);
  }

  render() {
    return (
      <nav className='navbar-mobile'>
        {this.renderMobileMenu()}
        {this.renderHamburger()}
        <Logo />
        {/* <i className="fas fa-search"></i> */}
      </nav>
    )
  }

  renderHamburger() {
    const { activeIcon } = this.state;
    return (
      <i className={`fas ${toggleClass((activeIcon === 'hamburger'), 'fa-times', 'fa-bars')}`}
        onClick={this.toggleHamburger}></i>
    );
  }

  toggleHamburger(e) {
    e.stopPropagation();
    this.setState({
      activeIcon: (this.state.activeIcon !== 'hamburger') ? 'hamburger' : null,
    });
  }

  renderMobileMenu() {
    const { activeIcon } = this.state;
    if (activeIcon !== 'hamburger') return null;
    const { currentUser, blog, confirmLogout } = this.props;
    return (
      <NavbarMobileMenu
        confirmLogout={confirmLogout}
        currentUser={currentUser}
        blog={blog} />
    );
  }
}

export default NavbarMobile;