import React from 'react';
import { connect } from 'react-redux';

import { fetchNotes } from '../../actions/note_actions';
import { selectNotes, selectUsers } from '../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const { post } = ownProps;
  const notesArr = selectNotes(state, post._id);
  const users = selectUsers(state);
  return {
    post,
    notesArr,
    users,
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

    this.renderNoteIndex = this.renderNoteIndex.bind(this);
    this.renderNoteShowItems = this.renderNoteShowItems.bind(this);
    this.renderNoteShow = this.renderNoteShow.bind(this);
    this.renderLike = this.renderLike.bind(this);
    this.renderComment = this.renderComment.bind(this);
  }

  render() {
    const { notesArr } = this.props;

    if (!notesArr) return <div className='note-popover popover'>Loading</div>;
    return (
      <div className='note-popover popover'>
        {this.renderNoteIndex()}
        <footer className='note-form-comment'>
          <div className='comment-input'>
            Unleash a compliment.
          </div>
          <button className='comment-submit'>
            Reply
          </button>
        </footer>
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
      <div className='note-index'>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopover);