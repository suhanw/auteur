import React from 'react';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <nav className='navbar'>
        <div>Search bar</div>
        <ul className='navbar-right'>
          <li onClick={this.props.confirmLogout}>Logout</li>
        </ul>
      </nav>
    );
  }

  componentDidMount() {
    // clicking anywhere else on the window should close any/all popovers
    const { closePopover } = this.props;
    window.addEventListener('click', () => closePopover());
  }

  componentWillUnmount() {
    const { closePopover } = this.props;
    window.removeEventListener('click', () => closePopover());
  }
}

export default Navbar;