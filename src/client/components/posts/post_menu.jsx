import React from 'react';

class PostMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className='post-menu'>
        <li className='post-menu-item'>
          <i className="fas fa-font"></i>
          <span>Text</span>
        </li>
        <li className='post-menu-item'>
          <i className="fas fa-camera-retro"></i>
          <span>Photo</span>
        </li>
        <li className='post-menu-item'>
          <i className="fas fa-quote-left"></i>
          <span>Quote</span>
        </li>
        <li className='post-menu-item'>
          <i className="fas fa-link"></i>
          <span>Link</span>
        </li>
        <li className='post-menu-item'>
          <i className="fas fa-headphones-alt"></i>
          <span>Audio</span>
        </li>
        <li className='post-menu-item'>
          <i className="fas fa-video"></i>
          <span>Video</span>
        </li>
      </ul>
    )
  }
}

export default PostMenu;