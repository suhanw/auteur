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
          <li className='note-show-like'>
            <img className='avatar avatar-extra-small' />
            <h1>
              NoteShowLike
            </h1>
          </li>
          <li className='note-show-comment'>
            <img className='avatar avatar-extra-small' />
            <section className='comment-body'>
              <h1>NoteShowComment</h1>
              <p>comment body blah blah blah blah blah</p>
            </section>
          </li>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopover);