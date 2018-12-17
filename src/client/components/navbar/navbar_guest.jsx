import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Logo from '../logo/logo';
// import Searchbar from '../search/search_bar';

class NavbarGuest extends React.Component {
  constructor(props) {
    super(props);

    this.renderSessionButtons = this.renderSessionButtons.bind(this);
    this.scrollToIntroSlide = this.scrollToIntroSlide.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.renderSignupButton = this.renderSignupButton.bind(this);
  }

  render() {

    return (
      <nav className='navbar guest'>

        <div className='navbar-left'>
          <Logo />
          {/* <Searchbar /> */}
        </div>

        {this.renderSessionButtons()}

      </nav>
    );
  }

  renderSessionButtons() {
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
      <Link key='login' to='/login' onClick={handleClick}>
        <li className={`btn btn-default btn-transparent ${active}`}>
          Log in
      </li>
      </Link>
    );
  }

  renderSignupButton(active = '', handleClick = null) {
    // TODO: cutout text for white button
    return (
      <Link key='signup' to='/signup' onClick={handleClick}>
        <li className={`btn btn-default btn-white ${active}`}>
          Sign up
        </li>
      </Link>
    );
  }

  scrollToIntroSlide(e) {
    const { scrollCarousel } = this.props;
    scrollCarousel('down', 1);
  }

}

export default withRouter(NavbarGuest);
