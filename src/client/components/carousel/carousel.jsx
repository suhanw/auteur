import React from 'react';
import { Route } from 'react-router-dom'
import { merge } from 'lodash';

import SessionFormContainer from '../session/session_form_container';
import NavbarContainer from '../navbar/navbar_container';

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
      // FIX: use isTransitioning state, to control when to fire scroll event
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
    ];


    this.introBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    this.welcomeBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    this.renderSessionForm = this.renderSessionForm.bind(this);
    this.renderIntroSlide = this.renderIntroSlide.bind(this);
    this.renderWelcomeSlide = this.renderWelcomeSlide.bind(this);
    this.renderAboutSlide = this.renderAboutSlide.bind(this)
    this.renderAboutSlideGraphic = this.renderAboutSlideGraphic.bind(this);
    this.renderCreateSlide = this.renderCreateSlide.bind(this);
    this.renderCreateSlideGraphic = this.renderCreateSlideGraphic.bind(this);
    this.scrollCarousel = this.scrollCarousel.bind(this);
    this.throttleWheel = this.throttleWheel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  render() {

    const { activeSlide } = this.state;

    return (
      <section className='carousel'>
        <Route path='/' render={(props) =>
          <NavbarContainer {...props}
            scrollCarousel={this.scrollCarousel}
            activeSlide={activeSlide} />
        } />

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

  renderIntroSlide() {
    const { activeSlide, slideClasses, introBgLoaded } = this.state;
    const introBgImg = (introBgLoaded) ?
      <div className='slide-bg bg-fade-in'
        style={{ backgroundImage: `url(${this.introBg})` }} /> :
      null;


    return (
      <div className={'intro-slide' + slideClasses[1]}
        onWheel={activeSlide === 1 ? this.throttleWheel(500, this.scrollCarousel) : null}>

        {introBgImg}

        <section className='intro-slide-content object-fade-in'>
          <h1 className='logo'>auteur</h1>
          <p className='slide-description'>
            Come for what you love.
          </p>
          <p className='slide-description'>
            Stay for what you discover.
          </p>
          {this.renderSessionForm()}

        </section>


        <footer className='intro-slide-footer footer-slide-up'>
          <ul className='footer-links'>
            <li className='footer-link'>
              <a href='#' onClick={this.toggleDrawer}>
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
            onClick={this.handleClick(2)}>What is Auteur?</span>
        </footer>

      </div>
    );
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

  renderCreateSlide() {
    const { activeSlide, slideClasses } = this.state;
    return (
      <div className={'create-slide' + slideClasses[3]}
        onWheel={activeSlide === 3 ? this.throttleWheel(500, this.scrollCarousel) : null}>

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
    const { activeSlide } = this.state;

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

  renderAboutSlide() {
    const { activeSlide, slideClasses } = this.state;
    return (
      <div className={'about-slide' + slideClasses[2]}
        onWheel={activeSlide === 2 ? this.throttleWheel(500, this.scrollCarousel) : null}>

        {this.renderAboutSlideGraphic()}

        <section className='slide-content'>
          <h2 className='slide-title'>Auteur is my nerd project on coding and movies. </h2>
          <p className='slide-description'>
            Auteur is a full-stack single-page web application inspired by Tumblr. It utilizes Node.js Express framework on the backend, a MongoDB database, React.js with Redux framework on the frontend, CSS3 and JavaScript for UI animations, and good old HTML5.
          </p>
        </section>
      </div >
    );
  }

  renderAboutSlideGraphic() {
    const { activeSlide } = this.state;

    let animatedGraphic = (
      <section className='slide-graphic'>
        <h1 className='logo font-grow-from-center'>a</h1>
        <div className='icon-gallery'>
          <i className="fly-in-tl-br fab fa-js-square" style={{ top: 120, left: 110, fontSize: 110 }}></i>
          <i className="fly-in-br-tl fab fa-node-js" style={{ top: 270, left: 350, fontSize: 120 }}></i>
          <i className="fly-in-t-b fab fa-html5" style={{ top: 110, left: 240, fontSize: 60 }}></i>
          <i className="fly-in-b-t fab fa-css3-alt" style={{ top: 300, left: 210, fontSize: 100 }}></i>
          <i className="fly-in-tr-bl fab fa-react" style={{ top: 80, left: 300, fontSize: 120 }}></i>
          <i className="fly-in-b-t fas fa-code-branch" style={{ top: 300, left: 300, fontSize: 50 }}></i>
          <i className="fly-in-r-l devicon-mongodb-plain" style={{ top: 120, left: 410, fontSize: 60 }}></i>
          <i className="fly-in-bl-tr devicon-amazonwebservices-original" style={{ top: 320, left: 95, fontSize: 100 }}></i>
          <i className="fly-in-tr-bl devicon-jquery-plain" style={{ top: 180, left: 400, fontSize: 80 }}></i>
          <i className="fly-in-t-b devicon-webpack-plain" style={{ top: 20, left: 250, fontSize: 80 }}></i>
          <i className="fly-in-br-tl devicon-heroku-original" style={{ top: 210, left: 340, fontSize: 50, fontWeight: 'bold' }}></i>
          <img className='fly-in-tr-bl icon' src='images/icons/arrival.png' style={{ top: 30, right: 70, height: 100 }} />
          <img className='fly-in-l-r icon' src='images/icons/bttf.png' style={{ top: 130, left: 30, height: 65 }} />
          <img className='fly-in-bl-tr icon' src='images/icons/d9.png' style={{ bottom: 50, left: 30, height: 60 }} />
          <img className='fly-in-br-tl icon' src='images/icons/die-hard.png' style={{ top: 230, right: 0, height: 110 }} />
          <img className='fly-in-tl-br icon' src='images/icons/ghosbusters.png' style={{ top: 50, left: 180, height: 65 }} />
          <img className='fly-in-tr-bl icon' src='images/icons/gits.png' style={{ top: 120, right: 0, height: 100 }} />
          <img className='fly-in-l-r icon' src='images/icons/jurassic-park.png' style={{ top: 210, left: 0, height: 130 }} />
          <img className='fly-in-b-t icon' src='images/icons/nostromo.png' style={{ bottom: 5, right: 80, height: 50 }} />
          <img className='fly-in-l-r icon' src='images/icons/blade-runner.png' style={{ top: 230, left: 140, height: 80 }} />
          <img className='fly-in-tl-br icon' src='images/icons/weyland-yutani.png' style={{ top: 20, left: 30, height: 150 }} />
        </div>
      </section>
    );
    if (activeSlide === 2) return animatedGraphic;

    return (
      <section className='slide-graphic'>
        <h1 className='logo'>a</h1>
        <div className='icon-gallery'>
          <i className="fab fa-js-square" style={{ top: 120, left: 110, fontSize: 110 }}></i>
          <i className="fab fa-node-js" style={{ top: 270, left: 350, fontSize: 120 }}></i>
          <i className="fab fa-html5" style={{ top: 110, left: 240, fontSize: 60 }}></i>
          <i className="fab fa-css3-alt" style={{ top: 300, left: 210, fontSize: 100 }}></i>
          <i className="fab fa-react" style={{ top: 80, left: 300, fontSize: 120 }}></i>
          <i className="fas fa-code-branch" style={{ top: 300, left: 300, fontSize: 50 }}></i>
          <i className="devicon-mongodb-plain" style={{ top: 120, left: 410, fontSize: 60 }}></i>
          <i className="devicon-amazonwebservices-original" style={{ top: 320, left: 95, fontSize: 100 }}></i>
          <i className="devicon-jquery-plain" style={{ top: 180, left: 400, fontSize: 80 }}></i>
          <i className="devicon-webpack-plain" style={{ top: 20, left: 250, fontSize: 80 }}></i>
          <i className="devicon-heroku-original" style={{ top: 210, left: 340, fontSize: 50, fontWeight: 'bold' }}></i>
          <img className='icon' src='images/icons/arrival.png' style={{ top: 30, right: 70, height: 100 }} />
          <img className='icon' src='images/icons/bttf.png' style={{ top: 130, left: 30, height: 65 }} />
          <img className='icon' src='images/icons/d9.png' style={{ bottom: 50, left: 30, height: 60 }} />
          <img className='icon' src='images/icons/die-hard.png' style={{ top: 230, right: 0, height: 110 }} />
          <img className='icon' src='images/icons/ghosbusters.png' style={{ top: 50, left: 180, height: 65 }} />
          <img className='icon' src='images/icons/gits.png' style={{ top: 120, right: 0, height: 100 }} />
          <img className='icon' src='images/icons/jurassic-park.png' style={{ top: 210, left: 0, height: 130 }} />
          <img className='icon' src='images/icons/nostromo.png' style={{ bottom: 5, right: 80, height: 50 }} />
          <img className='icon' src='images/icons/blade-runner.png' style={{ top: 230, left: 140, height: 80 }} />
          <img className='icon' src='images/icons/weyland-yutani.png' style={{ top: 20, left: 30, height: 150 }} />
        </div>
      </section>
    );
  }

  renderWelcomeSlide() {
    const { activeSlide, slideClasses, welcomeBgLoaded } = this.state;
    const welcomeBgImg = (welcomeBgLoaded) ?
      <div className='slide-bg bg-fade-in'
        style={{ backgroundImage: `url(${this.welcomeBg})` }} /> :
      null;
    return (
      <div className={'welcome-slide' + slideClasses[4]}
        onWheel={activeSlide === 4 ? this.throttleWheel(500, this.scrollCarousel) : null}>

        {welcomeBgImg}

        <div className='welcome-slide-content object-fade-in'>
          <h1 className='slide-title'>Okay, you get the point.</h1>
          <p className='slide-description'>
            Check this out and let me know your thoughts.
          </p>
          {activeSlide === 1 ? null : this.renderSessionForm() /* don't render sess form when intro slide is rendering it */}
        </div>
      </div>
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
          <li className={'carousel-dot' + slideClasses[1]} onClick={this.handleClick(1)}></li>
          <li className={'carousel-dot' + slideClasses[2]} onClick={this.handleClick(2)}></li>
          <li className={'carousel-dot' + slideClasses[3]} onClick={this.handleClick(3)}></li>
          <li className={'carousel-dot' + slideClasses[4]} onClick={this.handleClick(4)}></li>
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

  handleClick(dotNum) {
    const that = this;
    return function (e) {
      e.preventDefault();
      const { activeSlide } = that.state;
      const scrollDir = activeSlide < dotNum ? 'up' : 'down';
      that.scrollCarousel(scrollDir, dotNum);
    }
  }

  scrollCarousel(scrollDir, nextSlide) {
    // FIX: also attach listener for up and down arrows
    const that = this;
    const { activeSlide, slideClasses } = that.state;
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
      newActiveSlide = !newActiveSlide ? (activeSlide - 1) : newActiveSlide;
      newSlideClasses[newActiveSlide] = ' active slidedown';
    } // when wheeling past first or last slide, don't re-render
    else {
      that.firstTouch = null
      return;
    }
    that.setState({
      activeSlide: newActiveSlide,
      slideClasses: newSlideClasses
    });
  }

}

export default Carousel;