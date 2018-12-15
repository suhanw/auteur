import React from 'react';

class CarouselWelcome extends React.Component {
  constructor(props) {
    super(props);

    this.renderWelcomeSlideBackground = this.renderWelcomeSlideBackground.bind(this);
  }

  render() {
    const {
      activeSlide,
      slideClasses,
      isScrolling,
      throttleWheel,
      scrollCarousel,
      renderSessionForm,
    } = this.props;

    const handleWheel = (activeSlide === 4 && !isScrolling) ? throttleWheel(500, scrollCarousel) : null;
    return (
      <div className={'welcome-slide' + slideClasses[4]}
        onWheel={handleWheel}>

        {this.renderWelcomeSlideBackground()}

        <div className='welcome-slide-content object-fade-in'>
          <h1 className='slide-title'>Okay, you get the point.</h1>
          <p className='slide-description'>
            Check this out and let me know your thoughts.
          </p>
          {activeSlide === 1 ? null : renderSessionForm() /* don't render sess form when intro slide is rendering it */}
        </div>
      </div>
    );
  }

  renderWelcomeSlideBackground() {
    const { welcomeBgLoaded, welcomeBg } = this.props;
    const welcomeBgImg = (welcomeBgLoaded) ?
      <div className='slide-bg bg-fade-in'
        style={{ backgroundImage: `url(${welcomeBg})` }} /> :
      null;
    return welcomeBgImg;
  }
}

export default CarouselWelcome;