import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class NavmenuGuest extends React.Component {
  constructor(props) {
    super(props);

    this.renderButtons = this.renderButtons.bind(this);
    this.scrollToIntroSlide = this.scrollToIntroSlide.bind(this);
  }

  render() {

    return (
      <nav className='navbar guest'>
        <div>Search bar</div>
        {this.renderButtons()}
      </nav>
    );
  }

  renderButtons() {
    const { activeSlide } = this.props;
    const { pathname } = this.props;
    let buttonsToRender;
    if (pathname === '/signup' && (activeSlide === 1 || activeSlide === 4)) {
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
    const { scrollCarousel } = this.props;
    scrollCarousel('down', 1);
  }


  componentWillMount() {

  }


}

export default withRouter(NavmenuGuest);
