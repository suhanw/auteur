import React from 'react';
import {Route} from 'react-router-dom'
import {AuthRoute} from '../util/route_util';
import SessionFormContainer from './session/session_form_container';

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 1,
      slides: ['intro-slide', 'about-slide', 'create-slide', 'welcome-slide'],
    }
  }

  render() {

    return(
      <section className='carousel'>
        <div className='welcome-slide'>
          This is welcome slide.
          <AuthRoute path='/login' component={SessionFormContainer} />
          <AuthRoute path='/signup' component={SessionFormContainer} />
        </div>
        <div className='create-slide'>
          This is create slide.
        </div>
        <div className='about-slide'>
          This is about slide.
        </div>
        <div className='intro-slide'>
          <h1 className='logo'>auteur</h1>
          <AuthRoute path='/login' component={SessionFormContainer} />
          <AuthRoute path='/signup' component={SessionFormContainer} />
        </div>
      </section>
    );
  }

  componentDidMount() {
    const slide = document.querySelector('.intro-slide');
    slide.addEventListener('wheel', function(e) {

    })
  }
}

export default Carousel;
