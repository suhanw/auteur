import React from 'react';

class Navmenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <nav className='navbar'>
        <div>Search bar</div>
        <ul className='navbar-right'>
          <li onClick={this.props.logout}>Logout</li>
        </ul>
      </nav>
    );
  }
}

export default Navmenu;