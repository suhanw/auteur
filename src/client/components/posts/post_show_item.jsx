import React from 'react';
import PostShowText from './post_show_text';
import PostShowPhoto from './post_show_photo';
import Dashboard from '../dashboard';
import { log } from 'util';

class PostShowItem extends React.Component {
  constructor(props) {
    super(props);

    // component state used for avatar's inline style
    this.state = {
      position: 'relative',
      top: 0,
    };

    this.renderPostShow = this.renderPostShow.bind(this);
    this.offsetAvatar = this.offsetAvatar.bind(this);
  }

  render() {
    console.log('PostShowItem render');

    const { post, blog } = this.props;
    let postDate = new Date(post.createdAt);
    postDate = postDate.toString();
    return (
      <li className='post-show-item'>
        <picture className='avatar-container'>
          <img
            className='avatar avatar-default'
            src={blog.avatarImageUrl}
            style={this.state}
            id={post._id} />
        </picture>
        <article className='post-content'>
          <div className='dogear'></div>
          <header className='post-header'>
            {blog.name}
          </header>

          {this.renderPostShow()}

          <footer className='post-footer'>
            <div className='tag-index'>This will be TagIndex</div>
            <div className='note-menu'>This will be NoteMenu</div>
          </footer>
        </article>
      </li>
    );
  }

  renderPostShow() {
    const { post } = this.props;
    switch (post.type) {
      case 'text':
        return <PostShowText post={post} />;
      case 'photo':
        return <PostShowPhoto post={post} />;
      default:
        return null;
    }
  }

  componentWillReceiveProps(newProps) {
    // console.log(newProps);
    const { scrollTop } = newProps;
    const { post } = this.props;
    const avatarElement = document.getElementById(post._id);
    // if scrolling puts the avatar top less than 70 px from viewport top
    console.log('avatarElement.offsetTop - scrollTop', avatarElement.offsetTop - scrollTop);
    if (avatarElement.offsetTop - scrollTop < 70) {
      console.log('offset avatar!');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // prevent re-render everytime scrollTop is updated, 
    // instead, componentWillReceiveProps will decide when to re-render
    if (this.props.scrollTop !== nextProps.scrollTop) {
      return false;
    }
    return true;
  }

  offsetAvatar() {

    // onscroll, detect avatar position
    // if (dashboard.scrollTop - avatar.offsetTop < 70 &&
    //   dashboard.scrollTop + avatar.clientHeight > avatar_container.offsetTop + avatar_container.clientHeight) {
    //   avatar.style.top = `${dashboard.scrollTop - avatar.offsetTop}px`;
    // }
    // then increment avatar top position
    // unless avatar bottom is at the bottom of the avatar container
  }
}

export default PostShowItem;