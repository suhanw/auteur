import React from 'react';

class CarouselCreate extends React.Component {
  constructor(props) {
    super(props);

    this.renderCreateSlideGraphic = this.renderCreateSlideGraphic.bind(this);
  }

  render() {
    const {
      activeSlide,
      slideClasses,
      isScrolling,
      throttleWheel,
      scrollCarousel,
    } = this.props;
    const handleWheel = (activeSlide === 3 && !isScrolling) ? throttleWheel(500, scrollCarousel) : null;
    return (
      <div className={'create-slide' + slideClasses[3]}
        onWheel={handleWheel}>

        {this.renderCreateSlideGraphic()}

        <section className='slide-content'>
          <h2 className='slide-title'>Seriously, I love coding and movies. </h2>
          <p className='slide-description'>
            I promise to give you a callback soon. A crazy event occurred when I was in the queue to get some curry at an Indian wedding. I was almost killed by an arrow at this function, but I apply a chokehold on the assailant, bind him with some ropes and call the police. Thankfully I survived despite the context stacked against me. Now, I need this.. to find closure.
          </p>
        </section>
      </div>
    );
  }

  renderCreateSlideGraphic() {
    const { activeSlide } = this.props;

    const animatedGraphic = (
      <section className='slide-graphic'>
        <div className='icon-gallery'>
          <div className='first-row'>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-text'><i className="fas fa-font"></i></span>
              <h3 className='object-fade-in icon-label'>Text</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-photo'><i className="fas fa-camera-retro"></i></span>
              <h3 className='object-fade-in icon-label'>Photo</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-quote'><i className="fas fa-quote-left"></i></span>
              <h3 className='object-fade-in icon-label'>Quote</h3>
            </span>
          </div>
          <div className='second-row'>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-link'><i className="fas fa-link"></i></span>
              <h3 className='object-fade-in icon-label'>Link</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-audio'><i className="fas fa-headphones-alt"></i></span>
              <h3 className='object-fade-in icon-label'>Audio</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-grow-from-center icon-bg icon-video'><i className="fas fa-video"></i></span>
              <h3 className='object-fade-in icon-label'>Video</h3>
            </span>
          </div>
        </div>
      </section>
    );

    if (activeSlide === 3) return animatedGraphic;

    return (
      <section className='slide-graphic'>
        <div className='icon-gallery'>
          <div className='first-row'>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-text'><i className="fas fa-font"></i></span>
              <h3 className='icon-label'>Text</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-photo'><i className="fas fa-camera-retro"></i></span>
              <h3 className='icon-label'>Photo</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-quote'><i className="fas fa-quote-left"></i></span>
              <h3 className='icon-label'>Quote</h3>
            </span>
          </div>
          <div className='second-row'>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-link'><i className="fas fa-link"></i></span>
              <h3 className='icon-label'>Link</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-audio'><i className="fas fa-headphones-alt"></i></span>
              <h3 className='icon-label'>Audio</h3>
            </span>
            <span className='icon-wrapper'>
              <span className='icon-bg icon-video'><i className="fas fa-video"></i></span>
              <h3 className='icon-label'>Video</h3>
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default CarouselCreate;