import React from 'react';
import { connect } from 'react-redux';

import { selectTags } from '../../selectors/selectors';
import { fetchTags } from '../../actions/search_actions';

const mapStateToProps = (state, ownProps) => {
  const tags = selectTags(state);
  const { query } = ownProps;
  return {
    tags,
    query,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchTags: (tagQuery) => dispatch(fetchTags(tagQuery)),
  };
};

class SearchPopover extends React.Component {
  constructor(props) {
    super(props);

    this.renderTagResults = this.renderTagResults.bind(this);
    this.renderBlogResults = this.renderBlogResults.bind(this);
  }

  render() {
    return (
      <div className={`search-popover popover`}>
        {this.renderTagResults()}
        {/* {this.renderBlogResults()} */}
      </div>
    );
  }

  renderTagResults() {
    const { query, tags } = this.props;
    let tagResults;
    tagResults = tags.allIds.map((tagId) => {
      let tagLabel = tags.byId[tagId].label;
      let tagRegex = new RegExp(`(.*)(${query})(.*)`); // to underline the query string that matches the tag label
      tagLabel = tagLabel.match(tagRegex);
      if (!tagLabel) return null;
      return (
        <li className='popover-menu-item'
          key={tagId}>
          {/* {tagLabel} */}
          {tagLabel[1]}
          <u>{tagLabel[2]}</u>
          {tagLabel[3]}
        </li>
      );
    });

    if (!tags.allIds.length) tagResults = <li className='popover-menu-item'>No matching tags</li>;

    return (
      <ul>
        <header className='popover-header'>TAGS</header>
        {tagResults}
      </ul >
    );
  }

  renderBlogResults() {
    // FIX: later..
  }

  componentDidMount() {
    const { query, fetchTags } = this.props;
    fetchTags(query);
  }

  componentWillReceiveProps(newProps) {
    const { fetchTags } = this.props;
    if (newProps.query !== this.props.query) {
      fetchTags(newProps.query);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPopover);