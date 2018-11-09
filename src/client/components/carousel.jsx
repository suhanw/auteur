import React from 'react';
import {Route} from 'react-router-dom'
import {AuthRoute} from '../util/route_util';
import {throttleWheelEvent} from '../util/carousel_util';
import SessionFormContainer from './session/session_form_container';

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 1,
      slides: {
        'intro-slide': 1,
        'about-slide': 2,
        'create-slide': 3,
        'welcome-slide': 4,
      },
    }

    this.scrollCarousel = this.scrollCarousel.bind(this);
    this.throttleWheel = this.throttleWheel.bind(this);
  }

  render() {
    const {activeSlide, slides} = this.state;
    console.log('current active slide', activeSlide);

    return(
      <section className='carousel'>
        <div  className={slides['welcome-slide'] === activeSlide ? 'welcome-slide active' : 'welcome-slide'}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is welcome slide.
          <AuthRoute path='/login' component={SessionFormContainer} />
          <AuthRoute path='/signup' component={SessionFormContainer} />
        </div>
        <div  className={slides['create-slide'] === activeSlide ? 'create-slide active' : 'create-slide'}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is create slide.
        </div>
        <div  className={slides['about-slide'] === activeSlide ? 'about-slide active' : 'about-slide'}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is about slide.
        </div>
        <div  className={slides['intro-slide'] === activeSlide ? 'intro-slide active' : 'intro-slide'}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          <h1 className='logo'>auteur</h1>
          <AuthRoute path='/login' component={SessionFormContainer} />
          <AuthRoute path='/signup' component={SessionFormContainer} />
        </div>
      </section>
    );
  }

  throttleWheel(delay, handleWheel) {
    const that = this;
    return  function(e) {
      e.stopPropagation();
      const currTime = Date.now(); // capture time at current event firing
      that.currTarget = e.target;
      if (!e.target.className.includes('active')) { //if slide already inactive...
        that.firstTouch = null; // stop throttling and triggering event handler.
        return;
      } else if (!that.firstTouch || e.target !== that.currTarget) { // if this is the start of wheeling OR this is a new slide
        that.currTarget = e.target; // capture slide (will update if new slide)
        that.firstTouch = currTime; // capture start time, but don't fire event handler yet.
        return;
      }
      const timeElapsed = currTime - that.firstTouch;
      if (timeElapsed > delay ) { // only call handler when wheeling has occured for specified delay
        console.log(timeElapsed, e.deltaY);
        handleWheel(e, currTime, delay);
      }
      console.log(that.firstTouch);
    };
  }

  scrollCarousel(e, currTime, delay) {
    const that = this;
    const {activeSlide, slides} = that.state;
    let newActiveSlide = activeSlide;
    // if user is wheeling up AND not at last slide
    if (e.deltaY > 0 && activeSlide < (Object.keys(slides).length)) {
      // scroll to next slide
      newActiveSlide += 1;
    }
    // else if user is wheeling down AND not at first slide
    else if (e.deltaY < 0 && activeSlide > 1) {
      // scroll to previous slide
      newActiveSlide -= 1;
    } else { // when wheeling past first or last slide, don't re-render
      that.firstTouch = null
      return;
    }
    console.log('new activeSlide', newActiveSlide);
    that.setState({activeSlide: newActiveSlide});
    that.firstTouch = null;
  }

  componentDidMount() {
    console.log('mounted');
  }

  componentWillUnmount() {
    console.log('unmounting');
  }

}

export default Carousel;
