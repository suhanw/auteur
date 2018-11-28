import React from 'react';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';

import { fetchNotes } from '../../actions/note_actions';
import { selectNotes, selectUsers, selectCurrentUser } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const { post } = ownProps;
  const notesArr = selectNotes(state, post._id);
  const users = selectUsers(state);
  const currentUser = selectCurrentUser(state);
  return {
    post,
    notesArr,
    users,
    currentUser,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {

  return {
    fetchNotes: (postId) => dispatch(fetchNotes(postId)),
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
    };

    this.renderNoteIndex = this.renderNoteIndex.bind(this);
    this.renderNoteShowItems = this.renderNoteShowItems.bind(this);
    this.renderNoteShow = this.renderNoteShow.bind(this);
    this.renderLike = this.renderLike.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderCommentForm = this.renderCommentForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { notesArr } = this.props;

    if (!notesArr) return <div className='note-popover popover'>Loading</div>;
    return (
      <div className='note-popover popover'>
        {this.renderNoteIndex()}
        {this.renderCommentForm()}
      </div >
    )
  }

  componentDidMount() {
    const { fetchNotes, post } = this.props;
    fetchNotes(post._id);
  }

  renderNoteIndex() {
    const { notesArr } = this.props;
    return (
      <div className='note-index' onClick={(e) => e.stopPropagation()}>
        <header className='note-index-header'>
          <span>
            {notesArr.length} notes
          </span>
        </header>
        <ul className='note-container'>

          {this.renderNoteShowItems()}

        </ul>
      </div>
    );
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
    // let noteAuthorUsername = null;
    // if (noteAuthor) noteAuthorUsername = noteAuthor.username;

    return (
      <li key={note._id} className='note-show-like'>
        <div className='note-show-avatar'>
          <img src={noteAuthor.avatarImageUrl} className='avatar avatar-extra-small' />
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
    return (
      <li key={note._id} className='note-show-comment'>
        <div className='note-show-avatar'>
          <img className='avatar avatar-extra-small' />
          <div className='note-show-comment-icon'>
            <i className="fas fa-comment"></i>
          </div>
        </div>
        <section className='comment-body'>
          <h1>{note.author}</h1>
          <p>{note.body}</p>
        </section>
      </li>
    );
  }

  renderCommentForm() {
    const { body } = this.state;
    let readyToSubmit = (body.length > 0) ? true : false;
    return (
      <form className='note-form-comment'>
        <ContentEditable className='comment-input'
          onChange={this.handleChange('body')}
          onClick={(e) => e.stopPropagation() /* to stop event from bubbling up to window closePopover */}
          html={body}
          disabled={false}
          placeholder='Unleash a compliment.'
          tagName='div' />
        <button className={`comment-submit`}
          onClick={this.handleSubmit}
          disabled={!readyToSubmit}>
          Reply
          </button>
      </form>
    );
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
    console.log('submitting comment', this.state);

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopover);