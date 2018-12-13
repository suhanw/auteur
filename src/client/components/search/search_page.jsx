import React from 'react';

class SearchPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { query } = this.props.match.params;

    return (
      <div>
        This is search page {query}.
      </div>
    );
  }
}

export default SearchPage;