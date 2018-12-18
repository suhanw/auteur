import React from 'react';
import NavbarContainer from '../navbar/navbar_container';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.throttleResizeNavbar = this.throttleResizeNavbar.bind(this);
    this.renderNavbarPerScreenSize = this.renderNavbarPerScreenSize.bind(this);
  }

  render() {
    return (
      <div className='settings'>
        <NavbarContainer />
        <div className='settings-content'>
          This will be settings. Stay tuned!
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.renderNavbarPerScreenSize();
    window.addEventListener('resize', this.throttleResizeNavbar());
  }

  componentWillUnmount() {
    this.props.renderNavbar(null); // to remove navbar when unmounting
    window.removeEventListener('resize', this.throttleResizeNavbar());
  }

  throttleResizeNavbar() {
    let resizeTimeout;
    const that = this;
    return function (e) {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(
          () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = null;
            that.renderNavbarPerScreenSize()
          },
          1000);
      }
    };
  }

  renderNavbarPerScreenSize() {
    if (window.innerWidth <= 812) {
      this.props.renderNavbar({ view: 'navbarMobile' });
    } else {
      this.props.renderNavbar({ view: 'navbarMain' });
    }
  }
}

export default Settings;