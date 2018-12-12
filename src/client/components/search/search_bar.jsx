import React from 'react';

import { toggleClass } from '../../util/misc_util';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
    }

    this.searchBarRef = React.createRef();

    this.toggleActiveSearchBar = this.toggleActiveSearchBar.bind(this);
  }

  render() {
    return (
      <div className={`search ${toggleClass(this.state.isActive, 'active', '')}`}>
        <i className="fas fa-search"
          onClick={() => this.searchBarRef.current.focus()}></i>
        <input type='text'
          className='search-bar'
          placeholder='Search Auteur'
          ref={this.searchBarRef}
          onFocus={() => this.toggleActiveSearchBar()}
          onBlur={() => this.toggleActiveSearchBar()} />
      </div>
    );
  }

  toggleActiveSearchBar() {
    this.setState({ isActive: !this.state.isActive });
  }
}

export default Searchbar;