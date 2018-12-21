import React from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';

import { fetchNotes, createNote, deleteNote, confirmDeleteComment } from '../../actions/note_actions';
import { selectNotes, selectUsers, selectCurrentUser, selectBlogs } from '../../selectors/selectors';
import { closePopover } from '../../actions/popover_actions';

const mapStateToProps = function (state, ownProps) {
  const { post } = ownProps;
  const notesArr = selectNotes(state, post._id);
  const users = selectUsers(state);
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  return {
    post,
    notesArr,
    users,
    blogs,
    currentUser,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {

  return {
    fetchNotes: (postId) => dispatch(fetchNotes(postId)),
    createNote: (note) => dispatch(createNote(note)),
    deleteNote: (note) => dispatch(deleteNote(note)),
    confirmDeleteComment: (comment) => dispatch(confirmDeleteComment(comment)),
    closePopover: () => dispatch(closePopover()),
  }
};


class NotePopover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'comment',
      body: '',
      author: props.currentUser._id,
      post: props.post._id,
      popover: null,
    };

    this.noteScrollingContainerRef = React.createRef();
    this.commentInputRef = React.createRef();

    this.renderNoteIndex = this.renderNoteIndex.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.renderNoteShowItems = this.renderNoteShowItems.bind(this);
    this.renderNoteShow = this.renderNoteShow.bind(this);
    this.renderLike = this.renderLike.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.toggleNotePopover = this.toggleNotePopover.bind(this);
    this.renderEllipsisPopover = this.renderEllipsisPopover.bind(this);
    this.toggleEllipsisPopover = this.toggleEllipsisPopover.bind(this);
    this.renderCommentForm = this.renderCommentForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { notesArr } = this.props;

    // TODO: add spinner when fetching notes
    if (!notesArr) return <div className='note-popover popover'>Loading</div>;
    return (
      <div className='note-popover popover' >
        {this.renderNoteIndex()}
        {this.renderCommentForm()}
      </div >
    )
  }

  componentDidMount() {
    const { fetchNotes, post } = this.props;
    fetchNotes(post._id).then(
      () => this.scrollToBottom()
    );
  }

  renderNoteIndex() {
    const { notesArr, blogs, post } = this.props;
    const postBlog = blogs[post.blog];
    let noteCount = notesArr.length;
    noteCount += (noteCount === 1) ? ' note' : ' notes';
    return (
      <div className='note-index'
        onClick={(e) => e.stopPropagation()}>
        <header className='note-index-header'>
          <span>
            {noteCount}
          </span>
        </header>
        <div className='scrolling-container'
          ref={this.noteScrollingContainerRef}>
          <ul className='note-container'>

            {this.renderNoteShowItems()}

            <li key={post._id} className='note-show-posted-by'>
              <div className='note-show-avatar'>
                <div style={{ backgroundImage: `url(${postBlog.avatarImageUrl})` }}
                  className='avatar avatar-extra-small' />
              </div>
              <h1>{postBlog.name}</h1> <small>posted this</small>
            </li>

          </ul>
        </div>
      </div >
    );
  }

  scrollToBottom() {
    // to scroll to last/latest note
    this.noteScrollingContainerRef.current.scrollTop = this.noteScrollingContainerRef.current.scrollHeight;
    // to focus caret on textbox
    this.commentInputRef.current.getEl().focus();
  }

  renderNoteShowItems() {
    const { notesArr } = this.props;
    if (notesArr.length === 0) return null;

    let noteShowItems = notesArr.map((note) => {
      return this.renderNoteShow(note);
    })

    return noteShowItems;
  }

  renderNoteShow(note) {
    const noteShowComponents = {
      'like': this.renderLike,
      'comment': this.renderComment,
    };
    const component = noteShowComponents[note.type];
    return component(note);
  };

  renderLike(note) {
    let noteAuthor = this.props.users[note.author];

    return (
      <li key={note._id} className='note-show-like'>
        <div className='note-show-avatar'>
          <div style={{ backgroundImage: `url(${noteAuthor.avatarImageUrl})` }}
            className='avatar avatar-extra-small' />
          <div className='note-show-like-icon'>
            <i className="fas fa-heart"></i>
          </div>
        </div>
        <h1>
          {noteAuthor.username}
        </h1>
      </li>
    );
  }

  renderComment(note) {
    const { currentUser } = this.props;
    const noteAuthor = this.props.users[note.author];
    const { popover } = this.state;
    let ellipsisPopover = {
      popoverId: note._id,
      popoverType: 'ellipsisPopover',
    };
    let ellipsisPopoverComponent = null;
    if (JSON.stringify(popover) === JSON.stringify(ellipsisPopover) &&
      currentUser._id === noteAuthor._id) { // user can only delete own notes
      ellipsisPopoverComponent = this.renderEllipsisPopover(note, ellipsisPopover);
    }

    return (
      <li key={note._id} className='note-show-comment'>
        <div className='note-show-avatar'>
          <div style={{ backgroundImage: `url(${noteAuthor.avatarImageUrl})` }}
            className='avatar avatar-extra-small' />
          <div className='note-show-comment-icon'>
            <i className="fas fa-comment"></i>
          </div>
        </div>
        <section className='comment-body'>
          <div className='comment-username'>
            <h1>{noteAuthor.username}</h1>
            <i className="fas fa-ellipsis-h"
              onClick={this.toggleEllipsisPopover(ellipsisPopover)}></i>
            {ellipsisPopoverComponent}
          </div>
          <div className='comment-content'
            dangerouslySetInnerHTML={{ __html: note.body }}></div>
        </section>
      </li>
    );
  }

  renderEllipsisPopover(note, currPopover) {
    return (
      <div className='ellipsis-popover popover'>
        <span className='popover-menu-item'
          onClick={(e) => {
            this.toggleEllipsisPopover(currPopover)(e); // close the ellipsis popover when ...
            this.props.confirmDeleteComment(note); // ...rendering confirm modal
          }}>
          Delete reply
        </span>
      </div>
    );
  }

  toggleEllipsisPopover(currPopover) {
    const { popover } = this.state;
    const that = this;
    return function (e) {
      e.stopPropagation();
      if (JSON.stringify(popover) === JSON.stringify(currPopover)) {
        that.setState({ popover: null });
      } else {
        that.setState({ popover: currPopover });
      }
    }
  }

  handleClick(clickAction, payload) {
    const executeAction = this.props[clickAction];
    const that = this;
    return function (e) {
      e.stopPropagation();
      executeAction(payload);
    };
  }

  renderCommentForm() {
    const { body } = this.state;
    let readyToSubmit = (body.length > 0) ? true : false;
    return (
      <div className='note-form-comment'
        onKeyDown={this.toggleNotePopover}>
        <ContentEditable className='comment-input'
          onChange={this.handleChange('body')}
          onClick={(e) => e.stopPropagation() /* to stop event from bubbling up to window closePopover */}
          html={body}
          disabled={false}
          placeholder='Unleash a compliment.'
          tagName='div'
          tabIndex='0'
          ref={this.commentInputRef} />
        <button className={`comment-submit`}
          onClick={this.handleSubmit}
          disabled={!readyToSubmit}>
          Reply
          </button>
      </div >
    );
  }

  toggleNotePopover(e) {
    e.stopPropagation();
    if (e.key === 'Escape') this.props.closePopover();
  }


  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation(); //to stop event from bubbling up to window closePopover
    if (this.state.body.length === 0) return; // don't submit if no comment text
    const { createNote } = this.props;
    createNote(this.state)
      .then(this.setState({ body: '' }));
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopover);