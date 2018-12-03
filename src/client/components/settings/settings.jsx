import React from 'react';
import NavbarContainer from '../navbar/navbar_container';

class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='settings'>
        <NavbarContainer />
        <div className='settings-content'>
          This will be settings. Stay tuned!
        </div>
      </div>
    );
  }
}

export default Settings;