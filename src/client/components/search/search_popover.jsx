import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectTags } from '../../selectors/selectors';
import { fetchTags } from '../../actions/search_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    query: ownProps.query,
    tags: selectTags(state),
  };
};

const mapDispatchToProps = (dispatch, _) => {
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
    const { query, tags, closePopover } = this.props;
    let tagResults;
    tagResults = tags.allIds.map((tagId) => {
      let tagLabel = tags.byId[tagId].label;
      let tagRegex = new RegExp(`(.*)(${query})(.*)`); // to underline the query string that matches the tag label
      let tagLabelArr = tagLabel.match(tagRegex);
      if (!tagLabelArr) return null; // if tags haven't been updated on change of query term
      return (
        <Link to={`/search/${tagLabel}`}
          key={tagId}
          onMouseDown={(e) => e.preventDefault() /* prevent default on mouse down will block the popover from stealing focus (i.e., trigger blur event on the search input) */}
          onClick={() => closePopover()}>
          <li className='popover-menu-item'>
            {tagLabelArr[1]}
            <u>{tagLabelArr[2]}</u>
            {tagLabelArr[3]}
          </li>
        </Link>
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
    // TODO: later..
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