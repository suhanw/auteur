import React from 'react';

import Credits from './credits';

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
    const { view, toggleDrawer } = this.props;
    const DrawerComponent = this.drawerComponents[view];
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

  componentDidMount() {
    this.drawerRef.current.focus();
  }

  handleKeydown(e) {
    e.persist();
    if (e.key === 'Escape') this.props.toggleDrawer(e);
  }

  handleClick(e) {
    e.persist();
    this.props.toggleDrawer(e);
  }
}

export default Drawer;