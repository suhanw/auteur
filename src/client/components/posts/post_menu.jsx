import React from 'react';
import { Link } from 'react-router-dom';

class PostMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className='post-menu'>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/text'>
            <i className="fas fa-font"></i>
            <span>Text</span>
          </Link>
        </li>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/photo'>
            <i className="fas fa-camera-retro"></i>
            <span>Photo</span>
          </Link>
        </li>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/quote'>
            <i className="fas fa-quote-left"></i>
            <span>Quote</span>
          </Link>
        </li>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/link'>
            <i className="fas fa-link"></i>
            <span>Link</span>
          </Link>
        </li>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/audio'>
            <i className="fas fa-headphones-alt"></i>
            <span>Audio</span>
          </Link>
        </li>
        <li className='post-menu-item'>
          <Link to='/dashboard/new/video'>
            <i className="fas fa-video"></i>
            <span>Video</span>
          </Link>
        </li>
      </ul>
    )
  }
}

export default PostMenu;