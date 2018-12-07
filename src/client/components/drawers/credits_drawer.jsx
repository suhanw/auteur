import React from 'react';

class CreditsDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='credits'>
        <header className='slide-title'>
          CreditsDrawer
        </header>

        <ul className='credits-list'>
          <li className='credit-item'>
            <a className='credit-link' href='https://www.tumblr.com/' target='_blank'>
              Tumblr
            </a>
            <p className='slide-description'>
              This is the amazing app that inspired my project.
            </p>
          </li>

          <li className='credit-item'>
            <a className='credit-link' href='https://www.moviemania.io/' target='_blank'>
              Moviemania
            </a>
            <p className='slide-description'>
              This is where I got all the beautiful high-res movie images.
            </p>
          </li>

          <li className='credit-item'>
            <a className='credit-link' href='http://tobiasahlin.com/spinkit/' target='_blank'>
              SpinKit
            </a>
            <p className='slide-description'>
              This is where I got all the cool spinners.
            </p>
          </li>

          <li className='credit-item'>
            <a className='credit-link' href='http://scifilogos.tumblr.com/' target='_blank'>
              Sci-Fi Logos
            </a>
            <p className='slide-description'>
              This is where I got all the awesome fictional logos from movies.
            </p>
          </li>
          <li className='credit-item'>
            <a className='credit-link' href='https://imgur.com/gallery/ocClU' target='_blank'>
              Arrival Logograms
            </a>
            <p className='slide-description'>
              This is where I got the awesome logogram from Arrival.
            </p>
          </li>

          <li className='credit-item'>
            <a className='credit-link' href='http://konpa.github.io/devicon/' target='_blank'>
              Devicon
            </a>
            <p className='slide-description'>
              This is where I got the icons representing programming languages, frameworks, and tools.
            </p>
          </li>

          <li className='credit-item'>
            <a className='credit-link' href='https://fontawesome.com/' target='_blank'>
              Font Awesome
            </a>
            <p className='slide-description'>
              This is where I got all the other miscellaneous icons.
            </p>
          </li>
        </ul>

        <p className='copyright-disclaimer'>
          Please note that this website is created purely for my own personal and educational purposes.
        </p>


        <p className='copyright-disclaimer'>
          All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.
        </p>

        <p className='copyright-disclaimer'>
          Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair use is a use permitted by copyright statute that might otherwise be infringing. Non-profit, educational or personal use tips the balance in favor of fair use.
        </p>

        <footer>

        </footer>
      </div >
    );
  }
}

export default CreditsDrawer;