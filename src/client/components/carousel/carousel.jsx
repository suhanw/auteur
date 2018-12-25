import React from 'react';
import { Route } from 'react-router-dom'
import { merge } from 'lodash';

import SessionFormContainer from '../session/session_form_container';
import CarouselIntro from './carousel_intro';
import CarouselAbout from './carousel_about';
import CarouselCreate from './carousel_create';
import CarouselWelcome from './carousel_welcome';

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
      introBgLoaded: false,
      welcomeBgLoaded: false,
      isScrolling: false,
    };

    const backgroundImages = [
      'https://wallpapers.moviemania.io/desktop/movie/335984/e85174/blade-runner-2049-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/105/28f908/back-to-the-future-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/335984/841643/blade-runner-2049-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/329865/c4839e/arrival-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/157336/4017e1/interstellar-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/27205/8475b1/inception-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/348/8f23af/alien-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/17654/6049b8/district-9-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/14160/46ef21/up-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/tv/66732/ebe0a4/stranger-things-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/155/3ee006/the-dark-knight-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/286217/9c7511/the-martian-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/2756/f398a9/the-abyss-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/movie/1417/3ab2d6/pans-labyrinth-desktop-wallpaper.jpg?w=1920&h=1200',
      'https://wallpapers.moviemania.io/desktop/tv/1396/7f0992/breaking-bad-desktop-wallpaper.jpg?w=1920&h=1200',
    ];


    this.introBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    this.welcomeBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    this.renderSessionForm = this.renderSessionForm.bind(this);
    this.renderIntroSlide = this.renderIntroSlide.bind(this);
    this.renderWelcomeSlide = this.renderWelcomeSlide.bind(this);
    this.renderAboutSlide = this.renderAboutSlide.bind(this)
    this.renderCreateSlide = this.renderCreateSlide.bind(this);
    this.scrollCarousel = this.scrollCarousel.bind(this);
    this.throttleWheel = this.throttleWheel.bind(this);
    this.handleClickDot = this.handleClickDot.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  render() {
    return (
      <section className='carousel'>

        {this.renderWelcomeSlide()}

        {this.renderCreateSlide()}

        {this.renderAboutSlide()}

        {this.renderIntroSlide()}

        {this.renderCarouselIndicator()}

      </section>
    );
  }

  componentWillMount() {
    const introBg = new Image();
    introBg.src = this.introBg;
    introBg.onload = (e) => {
      this.setState({ introBgLoaded: true });
    };

    const welcomeBg = new Image();
    welcomeBg.src = this.welcomeBg;
    welcomeBg.onload = (e) => {
      this.setState({ welcomeBgLoaded: true });
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
    this.props.renderNavbar({
      view: 'navbarGuest',
      activeSlide: this.state.activeSlide,
      scrollCarousel: this.scrollCarousel,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    this.props.renderNavbar(null);
  }

  renderIntroSlide() {
    const { activeSlide, slideClasses, introBgLoaded, isScrolling } = this.state;
    return (
      <CarouselIntro
        introBgLoaded={introBgLoaded}
        introBg={this.introBg}
        activeSlide={activeSlide}
        slideClasses={slideClasses}
        isScrolling={isScrolling}
        throttleWheel={this.throttleWheel}
        scrollCarousel={this.scrollCarousel}
        toggleDrawer={this.toggleDrawer}
        renderSessionForm={this.renderSessionForm}
        handleClickDot={this.handleClickDot} />
    );
  }

  renderAboutSlide() {
    const { activeSlide, slideClasses, isScrolling } = this.state;
    return (
      <CarouselAbout
        activeSlide={activeSlide}
        slideClasses={slideClasses}
        isScrolling={isScrolling}
        throttleWheel={this.throttleWheel}
        scrollCarousel={this.scrollCarousel} />
    );
  }

  renderCreateSlide() {
    const { activeSlide, slideClasses, isScrolling } = this.state;
    return (
      <CarouselCreate
        activeSlide={activeSlide}
        slideClasses={slideClasses}
        isScrolling={isScrolling}
        throttleWheel={this.throttleWheel}
        scrollCarousel={this.scrollCarousel} />
    );
  }

  renderWelcomeSlide() {
    const { activeSlide, slideClasses, welcomeBgLoaded, isScrolling } = this.state;
    return (
      <CarouselWelcome
        welcomeBgLoaded={welcomeBgLoaded}
        welcomeBg={this.welcomeBg}
        activeSlide={activeSlide}
        slideClasses={slideClasses}
        isScrolling={isScrolling}
        throttleWheel={this.throttleWheel}
        scrollCarousel={this.scrollCarousel}
        renderSessionForm={this.renderSessionForm} />
    );
  }

  renderSessionForm() {
    return (
      <div>
        <Route path='/login' render={() => {
          return <SessionFormContainer
            path={this.props.match.path}
            pathname={this.props.location.pathname} />
        }} />
        <Route path='/signup' render={() => {
          return <SessionFormContainer
            path={this.props.match.path}
            pathname={this.props.location.pathname} />
        }} />
        <Route exact path='/' render={() => {
          return <SessionFormContainer
            path={this.props.match.path}
            pathname={this.props.location.pathname} />
        }} />
      </div>
    )
  }

  renderCarouselIndicator() {
    const { slideClasses } = this.state;
    return (
      <div className='carousel-indicator'>
        <ul className='carousel-dots'>
          <li className={'carousel-dot' + slideClasses[1]} onClick={this.handleClickDot(1)}></li>
          <li className={'carousel-dot' + slideClasses[2]} onClick={this.handleClickDot(2)}></li>
          <li className={'carousel-dot' + slideClasses[3]} onClick={this.handleClickDot(3)}></li>
          <li className={'carousel-dot' + slideClasses[4]} onClick={this.handleClickDot(4)}></li>
        </ul>
      </div>
    );
  }

  throttleWheel(delay, handleWheel) {
    let start = Date.now();
    return function (e) {
      e.stopPropagation();
      let currTime = Date.now();
      let timeElapsed = currTime - start;
      //only execute handler after specified delay AND calibrate touchpad swipe 'sensitivity'
      if (timeElapsed > delay && Math.abs(e.deltaY) > 60) {
        let scrollDir = e.deltaY > 0 ? 'up' : 'down';
        handleWheel(scrollDir);
        start = currTime; // restart countdown for next handler call.
      }
    }
  }

  handleClickDot(dotNum) {
    const that = this;
    return function (e) {
      e.preventDefault();
      const { activeSlide } = that.state;
      const scrollDir = activeSlide < dotNum ? 'up' : 'down';
      that.scrollCarousel(scrollDir, dotNum);
    }
  }

  handleKeydown(e) {
    if (e.key === 'ArrowDown') this.scrollCarousel('up');
    if (e.key === 'ArrowUp') this.scrollCarousel('down');
  }

  scrollCarousel(scrollDir, nextSlide = null) {
    const { activeSlide, slideClasses } = this.state;
    let newActiveSlide = nextSlide;
    let newSlideClasses = merge({}, slideClasses);
    // if user is wheeling up AND not at last slide
    if (scrollDir === 'up' && activeSlide < (Object.keys(slideClasses).length)) {
      // scroll to next slide
      newSlideClasses[activeSlide] = ' slideup';
      // use manually passed in next active slide if provided
      newActiveSlide = !newActiveSlide ? (activeSlide + 1) : newActiveSlide;
      newSlideClasses[newActiveSlide] = ' active';
    }
    // else if user is wheeling down AND not at first slide
    else if (scrollDir === 'down' && activeSlide > 1) {
      // scroll to previous slide
      newSlideClasses[activeSlide] = '';
      // use manually passed in next active slide if provided
      newActiveSlide = !newActiveSlide ? (activeSlide - 1) : newActiveSlide;
      newSlideClasses[newActiveSlide] = ' active slidedown';
    }
    // when wheeling past first or last slide, do nothing
    else return;
    this.setState({
      activeSlide: newActiveSlide,
      slideClasses: newSlideClasses,
      isScrolling: true,
    }, () => {
      this.props.renderNavbar({ // to pass the latest active slide to Navbar component
        view: 'navbarGuest',
        activeSlide: this.state.activeSlide,
        scrollCarousel: this.scrollCarousel,
      });
      setTimeout(
        () => this.setState({ isScrolling: false }),
        500
      );
    });
  }

  toggleDrawer(e) {
    e.preventDefault();
    const { openDrawer } = this.props;
    let creditsDrawer = {
      view: 'credits',
      data: null,
    };
    openDrawer(creditsDrawer);
  }

}

export default Carousel;