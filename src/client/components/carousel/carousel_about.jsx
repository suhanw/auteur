import React from 'react';

class CarouselAbout extends React.Component {
  constructor(props) {
    super(props);

    this.renderAboutSlideGraphic = this.renderAboutSlideGraphic.bind(this);
  }

  render() {
    const {
      activeSlide,
      slideClasses,
      isScrolling,
      throttleWheel,
      scrollCarousel
    } = this.props;
    // only attach wheel handler when slide is active and not during animated scrolling
    const handleWheel = (activeSlide === 2 && !isScrolling) ? throttleWheel(500, scrollCarousel) : null;
    return (
      <div className={'about-slide' + slideClasses[2]}
        onWheel={handleWheel}>

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
    const { activeSlide } = this.props;

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
}

export default CarouselAbout;