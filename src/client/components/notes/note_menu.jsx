import React from 'react';
import { closePopover } from '../../actions/popover_actions';

class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   display: 'none',
    // };

    this.handleClick = this.handleClick.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.renderHeart = this.renderHeart.bind(this);
    this.renderCog = this.renderCog.bind(this);
  }

  render() {
    console.log('rendering NoteMenu');

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

  componentDidMount() {
    // window.addEventListener('click', this.togglePopover);
  }

  componentWillUnmount() {
    // window.removeEventListener('click', this.togglePopover);
  }

  // componentWillUpdate(newProps, newState) {
  //   const { closePopover } = this.props;
  //   if (newState.display === 'none') closePopover
  // }

  shouldComponentUpdate(newProps, newState) {
    // FIX: think about how to avoid re-rendering every single post item
  }

  renderHeart() {
    return (
      <li className='note-menu-item'>
        <i className="far fa-heart"></i>
      </li>
    );
  }

  renderCog() {
    const { post, popover } = this.props;
    // unique identifier for current popover
    const editDeletePopover = {
      popoverId: post._id,
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
          <span>Edit</span>
          <span onClick={this.handleClick('confirmDeletePost')}>Delete</span>
        </div>
      </li>
    );
  }

  handleClick(action) {
    const executeAction = this.props[action];
    const { post, closePopover } = this.props;
    const that = this;
    return function (e) {
      e.stopPropagation();
      executeAction(post);
      closePopover();
    };
  }

  togglePopover(currPopover) {
    const { popover, openPopover, closePopover } = this.props;
    return function (e) {
      if (JSON.stringify(popover) === JSON.stringify(currPopover)) {
        closePopover(); // if current popover is open, then close popover
      } else {
        openPopover(currPopover); // otherwise open current popover
      }
    }
  }
}

export default NoteMenu;