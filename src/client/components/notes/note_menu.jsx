import React from 'react';

class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'none',
    };

    this.togglePopover = this.togglePopover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { post, currentUser } = this.props;
    // render cog if the post belongs to current user, else render heart
    let lastItem = (
      <li className='note-menu-item'>
        <i className="far fa-heart"></i>
      </li>
    );
    if (post.author === currentUser._id) {
      lastItem = (
        <li className='note-menu-item'>
          <i className="fas fa-cog" onClick={this.togglePopover}></i>
          <div className='post-edit-delete popover' style={this.state}>
            <span>Edit</span>
            <span onClick={this.handleClick('confirmDeletePost')}>Delete</span>
          </div>
        </li>
      );
    }
    return (
      <div className='note-menu-container'>
        <span>This will be NoteMenu</span>
        <ul className='note-menu'>
          <li className='note-menu-item'>
            <i className="far fa-comment"></i>
          </li>
          {lastItem}
        </ul>
      </div>
    );
  }

  handleClick(action) {
    const executeAction = this.props[action];
    const { post } = this.props;
    const that = this;
    return function (e) {
      executeAction(post);
      that.togglePopover();
    };
  }

  togglePopover() {
    if (this.state.display === 'none') {
      this.setState({ display: 'inline-block' });
    } else {
      this.setState({ display: 'none' });
    }

    // FIX: also need to be able to toggle when user clicks anywhere outside the popover.
  }
}

export default NoteMenu;