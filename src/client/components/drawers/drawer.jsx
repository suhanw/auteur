import { connect } from 'react-redux';
import React from 'react';

import Credits from './credits';
import { selectDrawer } from '../../selectors/selectors';
import { closeDrawer } from '../../actions/drawer_actions';

const mapStateToProps = function (state, ownProps) {
  const drawer = selectDrawer(state);
  return {
    drawer,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
  };
};


class Drawer extends React.Component {
  constructor(props) {
    super(props);

    this.drawerComponents = {
      'credits': Credits,
    };

    this.drawerRef = React.createRef();

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { drawer } = this.props;
    if (!drawer) return null; // drawer in ui state is null when there is no open drawer
    const DrawerComponent = this.drawerComponents[drawer.view];
    return (
      <div className='background-greyout'
        onClick={this.handleClick}>
        <aside className='drawer drawer-slide-in'
          ref={this.drawerRef}
          tabIndex='0'
          onClick={(e) => e.stopPropagation() /* to close drawer only when clicking outside drawer */}
          onKeyDown={this.handleKeydown}>
          <DrawerComponent />
        </aside>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.drawerRef.current) { // this is null when drawer is not open
      this.drawerRef.current.focus();
    }
  }

  handleKeydown(e) {
    e.persist();
    if (e.key === 'Escape') this.props.closeDrawer();
  }

  handleClick(e) {
    e.persist();
    this.props.closeDrawer();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);