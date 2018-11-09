import React from 'react';
import {Route} from 'react-router-dom'
import {merge} from 'lodash';
import {AuthRoute} from '../util/route_util';
import {throttleWheelEvent} from '../util/carousel_util';
import SessionFormContainer from './session/session_form_container';
import NavbarContainer from './nav/navbar_container';

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 1,
      slideClasses: {
        1: ' active',
        2: '',
        3: '',
        4: '',
      },
    }

    this.scrollCarousel = this.scrollCarousel.bind(this);
    this.throttleWheel = this.throttleWheel.bind(this);
  }

  render() {

    const {activeSlide, slideClasses} = this.state;

    return(
      <section className='carousel'>
        <Route path='/' render={(props) =>
            <NavbarContainer {...props}
              scrollCarousel={this.scrollCarousel}
              activeSlide={activeSlide} />
          } />
        <div  className={'welcome-slide' + slideClasses[4]}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is welcome slide.
          <AuthRoute path='/login' component={SessionFormContainer} />
          <AuthRoute path='/signup' component={SessionFormContainer} />
        </div>
        <div  className={'create-slide' + slideClasses[3]}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is create slide.
        </div>
        <div  className={'about-slide' + slideClasses[2]}
              onWheel={this.throttleWheel(200, this.scrollCarousel)}>
          This is about slide.
        </div>
        <div  className={'intro-slide' + slideClasses[1]}
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
        const scrollDir = e.deltaY > 0 ? 'up' : 'down';
        handleWheel(scrollDir);
        that.firstTouch = null;
      }
      console.log(that.firstTouch);
    };
  }

  scrollCarousel(scrollDir, nextSlide) {
    const that = this;
    const {activeSlide, slideClasses} = that.state;
    console.log('curr active slide', activeSlide);
    let newActiveSlide = nextSlide;
    let newSlideClasses = merge({}, slideClasses);
    // if user is wheeling up AND not at last slide
    if (scrollDir === 'up' && activeSlide < (Object.keys(slideClasses).length)) {
      // scroll to next slide
      newSlideClasses[activeSlide] = ' slideup';
      // use manually passed in active slide if provided
      newActiveSlide = !newActiveSlide ? (activeSlide + 1) : newActiveSlide;
      newSlideClasses[newActiveSlide] = ' active';
    }
    // else if user is wheeling down AND not at first slide
    else if (scrollDir === 'down' && activeSlide > 1) {
      // scroll to previous slide
      newSlideClasses[activeSlide] = '';
      newActiveSlide = !newActiveSlide ? (activeSlide -1) : newActiveSlide;
      newSlideClasses[newActiveSlide] = ' active slidedown';
    } // when wheeling past first or last slide, don't re-render
    else {
      that.firstTouch = null
      return;
    }
    console.log('new active slide', newActiveSlide);
    that.setState({
      activeSlide: newActiveSlide,
      slideClasses: newSlideClasses
    });
    // that.firstTouch = null;
  }

}

export default Carousel;
