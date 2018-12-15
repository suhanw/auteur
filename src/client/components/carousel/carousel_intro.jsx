import React from 'react';

class CarouselIntro extends React.Component {
  constructor(props) {
    super(props);

    this.renderIntroSlideBackground = this.renderIntroSlideBackground.bind(this);
  }

  render() {
    const {
      activeSlide,
      slideClasses,
      isScrolling,
      throttleWheel,
      scrollCarousel,
      toggleDrawer,
      renderSessionForm,
      handleClickDot,
    } = this.props;

    const handleWheel = (activeSlide === 1 && !isScrolling) ? throttleWheel(500, scrollCarousel) : null;

    return (
      <div className={'intro-slide' + slideClasses[1]}
        onWheel={handleWheel}>

        {this.renderIntroSlideBackground()}

        <section className='intro-slide-content object-fade-in'>
          <h1 className='logo'>auteur</h1>
          <p className='slide-description'>
            Come for what you love.
          </p>
          <p className='slide-description'>
            Stay for what you discover.
          </p>
          {renderSessionForm()}

        </section>


        <footer className='intro-slide-footer footer-slide-up'>
          <ul className='footer-links'>
            <li className='footer-link'>
              <a href='#' onClick={toggleDrawer}>
                Credits
              </a>
            </li>
            <li className='footer-link'>
              <a href='https://www.linkedin.com/in/suhanwijaya/' target='_blank'>LinkedIn</a>
            </li>
            <li className='footer-link'>
              <a href='https://github.com/suhanw' target='_blank'>Github</a>
            </li>
            <li className='footer-link'>
              <a href='mailto:suhanw@gmail.com'>Contact Me</a>
            </li>
          </ul>
          <span className='footer-next-slide'
            onClick={handleClickDot(2)}>What is Auteur?</span>
        </footer>

      </div >
    );
  }

  renderIntroSlideBackground() {
    const { introBgLoaded, introBg } = this.props;
    const introBgImg = (introBgLoaded) ?
      <div className='slide-bg bg-fade-in'
        style={{ backgroundImage: `url(${introBg})` }} /> :
      null;
    return introBgImg;
  }
}

export default CarouselIntro;