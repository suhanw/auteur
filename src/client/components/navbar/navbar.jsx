import React from 'react';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.dynamicClosePopover = this.dynamicClosePopover.bind(this);
  }

  render() {

    return (
      <nav className='navbar'>
        <img src='https://s3.amazonaws.com/auteur-dev/Zhang-04.jpg' />
        <div>Search bar</div>
        <ul className='navbar-right'>
          <li onClick={this.props.confirmLogout}>Logout</li>
        </ul>
      </nav>
    );
  }

  componentDidMount() {
    // clicking anywhere else on the window should close any/all popovers
    window.addEventListener('click', this.dynamicClosePopover);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.dynamicClosePopover);
  }

  dynamicClosePopover() {
    const { popover, closePopover } = this.props;
    if (popover) { // only dispatch closePopover if there is an open popover
      closePopover();
    }
  }
}

export default Navbar;