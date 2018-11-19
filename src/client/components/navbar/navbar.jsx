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
}

export default Navbar;