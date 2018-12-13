import React from 'react';
import { withRouter } from 'react-router-dom'; // to access this.props.history.push

import SearchPopover from './search_popover';
import { toggleClass } from '../../util/misc_util';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      query: '',
    };

    this.searchPopover = {
      popoverId: 'searchPopover',
      popoverType: 'searchPopover',
    };

    this.searchBarRef = React.createRef();

    this.renderSearchIcon = this.renderSearchIcon.bind(this);
    this.renderSearchInput = this.renderSearchInput.bind(this);
    this.renderSearchPopover = this.renderSearchPopover.bind(this);
    this.toggleSearchPopover = this.toggleSearchPopover.bind(this);
    this.handleFocusSearchBar = this.handleFocusSearchBar.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className={`search ${toggleClass(this.state.isActive, 'active', '')}`}>
        {this.renderSearchIcon()}
        {this.renderSearchInput()}
        {this.renderSearchPopover()}
      </div>
    );
  }

  renderSearchIcon() {
    return (
      <i className="fas fa-search"
        onClick={() => this.searchBarRef.current.focus()}></i>
    );
  }

  renderSearchInput() {
    return (
      <input type='text'
        className='search-bar'
        name='query'
        placeholder='Search Auteur'
        ref={this.searchBarRef}
        onFocus={this.handleFocusSearchBar}
        onBlur={this.handleFocusSearchBar}
        onChange={this.handleSearchInput}
        onClick={(e) => e.stopPropagation() /* to prevent bubbling up to window closePopover */}
        onKeyDown={this.handleSubmit} />
    );
  }

  renderSearchPopover() {
    const { popover, closePopover } = this.props;
    const { query } = this.state;
    if (JSON.stringify(popover) !== JSON.stringify(this.searchPopover)) return null;
    return (
      <SearchPopover
        query={query}
        closePopover={closePopover} />
    );
  }

  handleFocusSearchBar(e) {
    let newState = { isActive: !this.state.isActive };
    this.setState(
      newState,
      this.toggleSearchPopover,
    );
  }

  handleSearchInput(e) {
    let newState = { query: e.currentTarget.value };
    this.setState(
      newState,
      this.toggleSearchPopover,
    );
  }

  handleSubmit(e) {
    if (e.key !== 'Enter' || !this.state.query.length) return;
    this.props.closePopover();
    this.props.history.push(`/search/${this.state.query}`);
  }

  toggleSearchPopover() {
    const { popover, openPopover, closePopover } = this.props;
    const { isActive, query } = this.state;
    if (isActive && query.length && // open popover only if user enters query
      JSON.stringify(popover) !== JSON.stringify(this.searchPopover)) { // and if popover is not already open
      openPopover(this.searchPopover);
    } else if ((!isActive || !query.length) && popover) { // if user clicks away, or there is no text in input field
      closePopover();
    }
  }
}

export default withRouter(SearchBar);