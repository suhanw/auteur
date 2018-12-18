import React from 'react';

import { GlobalContext } from '../../global_ context_provider';

class PostMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { currentUser } = this.context;
    return (
      <div className='post-menu-container'>
        <picture className='avatar-container'>
          <div className='avatar avatar-default'
            style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }} />
        </picture>
        <ul className='post-menu'>
          <li className='post-menu-item' onClick={this.handleClick('text')}>
            <i className="fas fa-font"></i>
            <span>Text</span>
          </li>
          <li className='post-menu-item' onClick={this.handleClick('photo')}>
            <i className="fas fa-camera-retro"></i>
            <span>Photo</span>
          </li>
          <li className='post-menu-item' onClick={this.handleClick('quote')}>
            <i className="fas fa-quote-left"></i>
            <span>Quote</span>
          </li>
          <li className='post-menu-item' onClick={this.handleClick('link')}>
            <i className="fas fa-link"></i>
            <span>Link</span>
          </li>
          <li className='post-menu-item' onClick={this.handleClick('audio')}>
            <i className="fas fa-headphones-alt"></i>
            <span>Audio</span>
          </li>
          <li className='post-menu-item' onClick={this.handleClick('video')}>
            <i className="fas fa-video"></i>
            <span>Video</span>
          </li>
        </ul>
      </div>
    )
  }

  handleClick(formType) {
    const { togglePostForm } = this.props;
    return function (e) {
      togglePostForm(formType);
    }
  }
}

PostMenu.contextType = GlobalContext;

export default PostMenu;