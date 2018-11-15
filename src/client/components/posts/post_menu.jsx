import React from 'react';

class PostMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className='post-menu'>
        <li className='post-menu-item'><i className="fas fa-font"></i></li>
        <li className='post-menu-item'><i className="fas fa-camera-retro"></i></li>
        <li className='post-menu-item'><i className="fas fa-quote-left"></i></li>
        <li className='post-menu-item'><i className="fas fa-link"></i></li>
        <li className='post-menu-item'><i className="fas fa-headphones-alt"></i></li>
        <li className='post-menu-item'><i className="fas fa-video"></i></li>
      </ul>
    )
  }
}

export default PostMenu;