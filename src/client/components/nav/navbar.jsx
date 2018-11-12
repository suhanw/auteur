import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class NavbarGuest extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.scrollToIntroSlide = this.scrollToIntroSlide.bind(this);
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
    const {currentUser, activeSlide} = this.props;
    const {pathname} = this.props;
    let buttonsToRender;
    if (currentUser) {
      buttonsToRender = (
        <li onClick={this.logout} className='btn btn-default btn-blue active'>Logout</li>
      );
    } else if (pathname === '/signup' && (activeSlide === 1 || activeSlide === 4)){
      buttonsToRender =
          [(<li key='login' className='btn btn-default btn-transparent active'>
            <Link to='/login'>Log in</Link>
          </li>),
          (<li key='signup' className='btn btn-default btn-white'>
            <Link to='/signup'>Sign up</Link>
          </li>)]
      ;
    } else if (pathname === '/login' && (activeSlide === 1 || activeSlide === 4)) {
      buttonsToRender =
          [(<li key='login' className='btn btn-default btn-transparent'>
            <Link to='/login'>Log in</Link>
          </li>),
          (<li key='signup' className='btn btn-default btn-white active'>
            <Link to='/signup'>Sign up</Link>
          </li>)]
      ;
    } else {
      // render both buttons if user is not at intro or welcome slide.
      buttonsToRender = [
          (<li key='login' className='btn btn-default btn-transparent active'>
            <Link to='/login' onClick={this.scrollToIntroSlide}>Log in</Link>
          </li>),
          (<li key='signup' className='btn btn-default btn-white active'>
            <Link to='/signup' onClick={this.scrollToIntroSlide}>Sign up</Link>
          </li>)
      ];
    }
    return (
      <ul className='navbar-right'>
        {buttonsToRender}
      </ul>
    );
  }

  scrollToIntroSlide(e) {
    const {scrollCarousel} = this.props;
    scrollCarousel('down', 1);
  }


  componentWillMount() {

  }


}

export default withRouter(NavbarGuest);
