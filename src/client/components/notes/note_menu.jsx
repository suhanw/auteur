import React from 'react';

class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: 'none',
    };

    this.handleClick = this.handleClick.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderHeart = this.renderHeart.bind(this);
    this.renderCog = this.renderCog.bind(this);
  }

  render() {
    const { post, currentUser } = this.props;
    // render cog if the post belongs to current user, else render heart
    return (
      <div className='note-menu-container'>
        <span>This will be NoteMenu</span>
        <ul className='note-menu'>
          <li className='note-menu-item'>
            <i className="far fa-comment"></i>
          </li>

          {post.author === currentUser._id ? this.renderCog() : this.renderHeart()}

        </ul>
      </div>
    );
  }

  renderHeart() {
    return (
      <li className='note-menu-item'>
        <i className="far fa-heart"></i>
      </li>
    );
  }

  renderCog() {
    return (
      <li className='note-menu-item'>
        <i className="fas fa-cog" onClick={this.togglePopover}></i>
        <div className='post-edit-delete popover' style={this.state}>
          <span>Edit</span>
          <span onClick={this.handleClick('confirmDeletePost')}>Delete</span>
        </div>
      </li>
    );
  }

  componentDidMount() {
    window.addEventListener('click', () => this.setState({ display: 'none' }));
  }

  componentWillUnmount() {
    window.removeEventListener('click', () => this.setState({ display: 'none' }));
  }

  handleClick(action) {
    const executeAction = this.props[action];
    const { post } = this.props;
    const that = this;
    return function (e) {
      e.stopPropagation();
      executeAction(post);
      that.togglePopover();
    };
  }

  togglePopover(e) {
    if (e) e.stopPropagation(); // e may be null when invoked via handleClick
    if (this.state.display === 'none') {
      this.setState({ display: 'inline-block' });
    } else {
      this.setState({ display: 'none' });
    }

    // FIX: also need to be able to toggle when user clicks anywhere outside the popover.
  }
}

export default NoteMenu;