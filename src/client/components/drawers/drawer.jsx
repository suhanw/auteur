import { connect } from 'react-redux';
import React from 'react';

import CreditsDrawer from './credits_drawer';
import BlogDrawer from '../blogs/blog_drawer';
import { selectDrawer, selectCurrentUser } from '../../selectors/selectors';
import { closeDrawer } from '../../actions/drawer_actions';
import { createFollow, deleteFollow } from '../../actions/follow_actions';

const mapStateToProps = function (state, ownProps) {
  const drawer = selectDrawer(state);
  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
    drawer,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    deleteFollow: (blogId) => dispatch(deleteFollow(blogId)),
  };
};


class Drawer extends React.Component {
  constructor(props) {
    super(props);

    this.drawerComponents = {
      'credits': CreditsDrawer,
      'blog': BlogDrawer,
    };

    this.drawerRef = React.createRef();
    this.greyBackgroundRef = React.createRef();

    this.closeDrawerTimer = null;

    this.animateCloseDrawer = this.animateCloseDrawer.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { drawer, currentUser, createFollow, deleteFollow } = this.props;
    if (!drawer) return null; // drawer in ui state is null when there is no open drawer
    const DrawerComponent = this.drawerComponents[drawer.view];
    return (
      <div className='background-greyout bg-fade-in'
        ref={this.greyBackgroundRef}
        onClick={this.handleClick}>
        <aside className='drawer drawer-slide-in'
          ref={this.drawerRef}
          tabIndex='0'
          onKeyDown={this.handleKeydown}>
          <DrawerComponent
            data={drawer.data}
            currentUser={currentUser}
            createFollow={createFollow}
            deleteFollow={deleteFollow} />
        </aside>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.drawerRef.current) { // this is null when drawer is not open
      this.drawerRef.current.focus();
    }
  }

  animateCloseDrawer() {
    // apply drawer-slide-out class to render drawer sliding out of view
    this.greyBackgroundRef.current.classList.replace('bg-fade-in', 'bg-fade-out');
    this.drawerRef.current.classList.replace('drawer-slide-in', 'drawer-slide-out');

    this.closeDrawerTimer = setTimeout(
      () => {
        this.props.closeDrawer();
        clearTimeout(this.closeDrawerTimer);
        this.closeDrawerTimer = null;
      },
      200,
    );
  }

  handleKeydown(e) {
    e.stopPropagation();
    e.persist();
    if (e.key === 'Escape') this.animateCloseDrawer();
  }

  handleClick(e) {
    if (e.currentTarget !== e.target) return; // if user click doesn't land on grey background, do nothing
    this.animateCloseDrawer();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)