import React from 'react';

class SearchPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderTagResults = this.renderTagResults.bind(this);
  }

  render() {
    const { popoverActive } = this.props;
    // debugger
    return (
      <div className={`search-popover popover ${popoverActive}`}>
        {this.renderTagResults()}
      </div>
    );
  }

  renderTagResults() {
    let tagResults = <li className='popover-menu-item'>Test</li>;
    return (
      <ul>
        <header className='popover-header'>TAGS</header>
        {tagResults}
      </ul>
    )
  }
}

export default SearchPopover;