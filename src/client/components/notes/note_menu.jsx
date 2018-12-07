import React from 'react';

import NotePopover from './note_popover';

class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderCommentBubble = this.renderCommentBubble.bind(this);
    this.renderHeart = this.renderHeart.bind(this);
    this.renderCog = this.renderCog.bind(this);
  }

  render() {
    const { post, currentUser } = this.props;
    let noteCount = null;
    if (post.likeCount + post.commentCount > 0) {
      noteCount = (post.likeCount + post.commentCount);
      noteCount += (noteCount === 1) ? ' note' : ' notes';
    }
    return (
      <div className='note-menu-container'>
        <span>{noteCount}</span>
        <ul className='note-menu'>

          {this.renderCommentBubble()}

          {/* render cog if the post belongs to current user, else render heart */}
          {post.author === currentUser._id ? this.renderCog() : this.renderHeart()}

        </ul>
      </div>
    );
  }

  shouldComponentUpdate(newProps, newState) {
    // FIX: think about how to avoid re-rendering every single post item when popover is opened/closed
    return true;
  }

  renderHeart() {
    const { post, currentUser } = this.props;
    let heartIconClass = 'far fa-heart';
    let clickAction = 'createNote';
    let note = {
      type: 'like',
      post: post._id,
      author: currentUser._id,
    };
    // check if current user liked this post
    if (currentUser.likedPosts && currentUser.likedPosts[post._id]) {
      heartIconClass = 'fas fa-heart';
      clickAction = 'deleteNote';
      note._id = currentUser.likedPosts[post._id];
    }
    return (
      <li className='note-menu-item'>
        <i className={heartIconClass}
          onClick={this.handleClick(clickAction, note)}></i>
      </li>
    );
  }

  renderCommentBubble() {
    const { view, post, popover } = this.props;
    const notePopover = {
      popoverId: `${post._id}_${view}`,
      popoverType: 'notePopover',
    };
    let notePopoverComponent = null;
    if (JSON.stringify(popover) === JSON.stringify(notePopover)) {
      notePopoverComponent = <NotePopover post={post} />
    }

    return (
      <li className='note-menu-item' >
        <i className="far fa-comment"
          onClick={this.togglePopover(notePopover)}></i>
        {notePopoverComponent}
      </li>
    );
  }

  renderCog() {
    const { view, post, popover, togglePostForm } = this.props;
    if (view === 'blogDrawer') return null;
    // unique identifier for current popover
    const editDeletePopover = {
      popoverId: `${post._id}_${view}`,
      popoverType: 'editDeletePopover',
    };
    // if open popover in redux state is current popover, display the popover
    const popoverStyle = JSON.stringify(popover) === JSON.stringify(editDeletePopover) ? { display: 'inline-block' } : { display: 'none' };

    return (
      <li className='note-menu-item'>
        <i className="fas fa-cog"
          onClick={this.togglePopover(editDeletePopover)}></i>
        <div className='post-edit-delete popover'
          style={popoverStyle}>
          <span className='popover-menu-item'
            onClick={togglePostForm}>
            Edit
          </span>
          <span className='popover-menu-item'
            onClick={this.handleClick('confirmDeletePost', post)}>
            Delete
          </span>
        </div>
      </li>
    );
  }

  handleClick(clickAction, payload) {
    const executeAction = this.props[clickAction];
    const { popover, closePopover } = this.props;
    return function (e) {
      e.stopPropagation();
      executeAction(payload);
      if (popover) closePopover();
    };
  }

  togglePopover(currPopover) {
    const { popover, openPopover, closePopover } = this.props;
    return function (e) {
      // debugger
      e.stopPropagation(); // to avoid bubbling up to window handler which will close any popovers
      if (JSON.stringify(popover) === JSON.stringify(currPopover)) {
        closePopover(); // if current popover is open, then close popover
      } else {
        openPopover(currPopover); // otherwise open current popover (which will auto close any other open popover)
      }
    };
  }
}

export default NoteMenu;