import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Logo from '../logo/logo';
import Searchbar from '../searchbar/searchbar';

class NavbarGuest extends React.Component {
  constructor(props) {
    super(props);

    this.renderButtons = this.renderButtons.bind(this);
    this.scrollToIntroSlide = this.scrollToIntroSlide.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.renderSignupButton = this.renderSignupButton.bind(this);
  }

  render() {

    return (
      <nav className='navbar guest'>

        <div className='navbar-left'>
          <Logo />
          <Searchbar />
        </div>

        {this.renderButtons()}

      </nav>
    );
  }

  renderButtons() {
    const { activeSlide } = this.props;
    const { pathname } = this.props;
    let buttonsToRender;
    if (pathname === '/signup' && (activeSlide === 1 || activeSlide === 4)) {
      buttonsToRender = [this.renderLoginButton('active'), this.renderSignupButton()];
    } else if (pathname === '/login' && (activeSlide === 1 || activeSlide === 4)) {
      buttonsToRender = [this.renderLoginButton(), this.renderSignupButton('active')];
    } else if (activeSlide !== 1) {
      // render both buttons if user is not at intro or welcome slide.
      buttonsToRender = [this.renderLoginButton('active', this.scrollToIntroSlide), this.renderSignupButton('active', this.scrollToIntroSlide)];
    }
    return (
      <ul className='navbar-right'>
        {buttonsToRender}
      </ul>
    );
  }

  renderLoginButton(active = '', handleClick = null) {
    return (
      <li key='login' className={`btn btn-default btn-transparent ${active}`}>
        <Link to='/login' onClick={handleClick}>Log in</Link>
      </li>
    );
  }

  renderSignupButton(active = '', handleClick = null) {
    // FIX: cutout text for white button
    return (
      <li key='signup' className={`btn btn-default btn-white ${active}`}>
        <Link to='/signup' onClick={handleClick}>Sign up</Link>
      </li>
    );
  }

  scrollToIntroSlide(e) {
    const { scrollCarousel } = this.props;
    scrollCarousel('down', 1);
  }

}

export default withRouter(NavbarGuest);
