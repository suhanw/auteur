import React from 'react';

import { GlobalContext } from '../global_ context_provider';
import NotePopover from './note_popover';

class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      isUnliked: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderCommentBubble = this.renderCommentBubble.bind(this);
    this.renderHeart = this.renderHeart.bind(this);
    this.renderLikeAction = this.renderLikeAction.bind(this);
    this.renderUnlikeAction = this.renderUnlikeAction.bind(this);
    this.renderCog = this.renderCog.bind(this);
    this.renderPaperPlane = this.renderPaperPlane.bind(this);
  }

  render() {
    const { currentUser } = this.context;
    const { post } = this.props;
    let noteCount = null;
    if (post.likeCount + post.commentCount > 0) {
      noteCount = (post.likeCount + post.commentCount);
      noteCount += (noteCount === 1) ? ' note' : ' notes';
    }
    return (
      <div className='note-menu-container'>
        <span>{noteCount}</span>
        <ul className='note-menu'>

          {this.renderPaperPlane()}
          {this.renderCommentBubble()}

          {/* render cog if the post belongs to current user, else render heart */}
          {post.author === currentUser._id ? this.renderCog() : this.renderHeart()}

        </ul>
      </div>
    );
  }

  shouldComponentUpdate(newProps, newState) {
    // TODO: think about how to avoid re-rendering every single post item when popover is opened/closed
    return true;
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

  renderHeart() {
    const { currentUser } = this.context;
    const { post } = this.props;
    let heartIconClass = 'far fa-heart';
    let clickAction = 'createNote';
    let note = {
      type: 'like',
      post: post._id,
      author: currentUser._id,
    };

    if (currentUser.likedPosts && currentUser.likedPosts[post._id]) { // render solid heart icon if current user liked this post
      heartIconClass = 'fas fa-heart';
      clickAction = 'deleteNote';
      note._id = currentUser.likedPosts[post._id];
    }
    return (
      <li className='note-menu-item'>
        <div className='heart-icon-container'>
          {this.state.isLiked ? this.renderLikeAction() : null}
          {this.state.isUnliked ? this.renderUnlikeAction() : null}
          <i className={heartIconClass}
            onClick={this.handleClick(clickAction, note)}></i>
        </div>
      </li>
    );
  }

  renderLikeAction() {
    return (
      <i className={`fas fa-heart like-action`} />
    );
  }

  renderUnlikeAction() {
    return (
      <i className="fas fa-sad-tear unlike-action"></i>
    );
  }

  renderCog() {
    const { view, post, popover, togglePostForm, postShowItemRef } = this.props;
    if (view === 'blogDrawer' || view === 'searchPosts') return null;
    // unique identifier for current popover
    const editDeletePopover = {
      popoverId: `${post._id}_${view}`,
      popoverType: 'editDeletePopover',
    };
    // if open popover in redux state is current popover, display the popover
    const popoverStyle = JSON.stringify(popover) === JSON.stringify(editDeletePopover) ? { display: 'inline-block' } : { display: 'none' };

    // pass ref to confirm modal to animate post deletion
    post.postShowItemRef = postShowItemRef;
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

  renderPaperPlane() {
    const { blog } = this.props;
    const { currentUser } = this.context;
    if (blog.author === currentUser._id) return null;
    return (
      <li className='note-menu-item'>
        <i className="far fa-paper-plane"
          onClick={this.handleClick('openChatDrawer', blog.name)}></i>
      </li>
    )
  }

  handleClick(clickAction, payload) {
    const executeAction = this.props[clickAction];
    const { popover, closePopover } = this.props;
    return (e) => {
      e.stopPropagation();
      if (popover) closePopover();
      if (['createNote', 'deleteNote'].includes(clickAction)) {
        let stateKey = (clickAction === 'createNote') ? 'isLiked' : 'isUnliked';
        this.setState({ [stateKey]: true }, () => {
          let timer = setTimeout(
            () => {
              clearTimeout(timer);
              timer = null;
              this.setState({ [stateKey]: false });
            },
            750
          );
        });
      }
      executeAction(payload);
    };
  }

  togglePopover(currPopover) {
    const { popover, openPopover, closePopover } = this.props;
    return function (e) {
      e.stopPropagation(); // to avoid bubbling up to window handler which will close any popovers
      if (JSON.stringify(popover) === JSON.stringify(currPopover)) {
        closePopover(); // if current popover is open, then close popover
      } else {
        openPopover(currPopover); // otherwise open current popover (which will auto close any other open popover)
      }
    };
  }
}

NoteMenu.contextType = GlobalContext;

export default NoteMenu;