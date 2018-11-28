import React from 'react';
import { connect } from 'react-redux';

import { fetchNotes } from '../../actions/note_actions';

const mapStateToProps = function (state, ownProps) {
  const { popoverStyle, post } = ownProps;
  return {
    popoverStyle,
    post,
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

    this.renderLike = this.renderLike.bind(this);
    this.renderComment = this.renderComment.bind(this);
  }

  render() {
    const { popoverStyle } = this.props;

    return (
      <div className='note-popover popover'
        style={popoverStyle}>
        <header className='note-index-header'>
          <span>
            2 notes
          </span>
        </header>
        <ul className='note-index'>

          {this.renderLike()}

          {this.renderComment()}

        </ul>
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
    // START HERE 
    // fetchNotes(post._id);
  }

  renderLike() {
    return (
      <li className='note-show-like'>
        <div className='note-show-avatar'>
          <img className='avatar avatar-extra-small' />
          <div className='note-show-like-icon'>
            <i className="fas fa-heart"></i>
          </div>
        </div>
        <h1>
          NoteShowLike
            </h1>
      </li>
    );
  }

  renderComment() {
    return (
      <li className='note-show-comment'>
        <div className='note-show-avatar'>
          <img className='avatar avatar-extra-small' />
          <div className='note-show-comment-icon'>
            <i className="fas fa-comment"></i>
          </div>
        </div>
        <section className='comment-body'>
          <h1>NoteShowComment</h1>
          <p>comment body blah blah blah blah blah</p>
        </section>
      </li>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopover);