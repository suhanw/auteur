import React from 'react';
import {Route, Link} from 'react-router-dom'
import {merge} from 'lodash';
import {AuthRoute} from '../util/route_util';
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
    this.handleClick = this.handleClick.bind(this);
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
              onWheel={activeSlide === 4 ? this.throttleWheel(500, this.scrollCarousel) : null}>
          <div className='welcome-slide-content fade-in'>
            <h1 className='logo'>auteur</h1>
            <p>
              Come for what you love.
            </p>
            <p>
              Stay for what you discover.
            </p>
            <Route exact path='/' component={SessionFormContainer} />
            <AuthRoute path='/login' component={SessionFormContainer} />
            <AuthRoute path='/signup' component={SessionFormContainer} />
          </div>
        </div>
        <div  className={'create-slide' + slideClasses[3]}
              onWheel={activeSlide === 3 ? this.throttleWheel(500, this.scrollCarousel) : null}>
          This is create slide.
        </div>
        <div  className={'about-slide' + slideClasses[2]}
              onWheel={activeSlide === 2 ? this.throttleWheel(500, this.scrollCarousel) : null}>
          This is about slide.
        </div>
        <div  className={'intro-slide' + slideClasses[1]}
              onWheel={activeSlide === 1 ? this.throttleWheel(500, this.scrollCarousel) : null}>
          <div className='intro-slide-content fade-in'>
            <h1 className='logo'>auteur</h1>
            <p>
              Come for what you love.
            </p>
            <p>
              Stay for what you discover.
            </p>
            <Route exact path='/' component={SessionFormContainer} />
            <AuthRoute path='/login' component={SessionFormContainer} />
            <AuthRoute path='/signup' component={SessionFormContainer} />
          </div>
          <footer className='intro-slide-footer footer-slide-up' onClick={this.handleClick(2)}>
            What is Auteur?
          </footer>
        </div>

        <div className='carousel-indicator'>
          <ul className='carousel-dots'>
            <li className={'carousel-dot' + slideClasses[1]} onClick={this.handleClick(1)}></li>
            <li className={'carousel-dot' + slideClasses[2]} onClick={this.handleClick(2)}></li>
            <li className={'carousel-dot' + slideClasses[3]} onClick={this.handleClick(3)}></li>
            <li className={'carousel-dot' + slideClasses[4]} onClick={this.handleClick(4)}></li>
          </ul>
        </div>
      </section>
    );
  }

  throttleWheel (delay, handleWheel) {
    let start = Date.now();
    let currTarget = null;
    return function(e) {
      e.stopPropagation();
      let currTime = Date.now();
      let timeElapsed = currTime - start;
      //only execute handler after specified delay AND a specified touchpad swipe 'size'
      if (timeElapsed > delay && Math.abs(e.deltaY) > 60) {
        let scrollDir = e.deltaY > 0 ? 'up': 'down';
        handleWheel(scrollDir);
        start = currTime; // restart countdown for next handler call.
      }
    }
  }

  handleClick(dotNum) {
    const that = this;
    return function(e) {
      e.preventDefault();
      const {activeSlide} = that.state;
      const scrollDir = activeSlide < dotNum ? 'up': 'down';
      that.scrollCarousel(scrollDir, dotNum);
    }
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
