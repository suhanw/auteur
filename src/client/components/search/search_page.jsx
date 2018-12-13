import React from 'react';
import { connect } from 'react-redux';

import NavbarContainer from '../navbar/navbar_container';
import PostIndexMasonry from '../posts/post_index/post_index_masonry';
import PostShowItem from '../posts/post_show/post_show_item';
import { selectPosts, selectCurrentUser, selectBlogs } from '../../selectors/selectors';
import { fetchSearchPosts, clearSearchPosts } from '../../actions/search_actions';
import { createFollow } from '../../actions/follow_actions';
import { openDrawer } from '../../actions/drawer_actions';

const mapStateToProps = (state, ownProps) => {
  const postsArr = selectPosts(state, 'searchPosts');
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  return {
    postsArr,
    blogs,
    currentUser,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchSearchPosts: (query) => dispatch(fetchSearchPosts(query)),
    clearSearchPosts: () => dispatch(clearSearchPosts()),
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    openDrawer: (drawer) => dispatch(openDrawer(drawer)),
  };
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props)

    this.renderHeader = this.renderHeader.bind(this);
    // this.renderSearchPosts = this.renderSearchPosts.bind(this);
    this.renderSearchPosts = this.renderSearchPosts.bind(this);
  }

  render() {

    return (
      <div className='search-page'>
        <NavbarContainer />
        <div className='search-page-content'>
          {this.renderHeader()}

          {/* {this.renderSearchBlogs()} */}
          {this.renderSearchPosts()}

        </div>
      </div>
    );
  }

  renderHeader() {
    const { query } = this.props.match.params;
    return (
      <header className='search-header'>
        <h1 className='search-term'>
          {query.toUpperCase()}
        </h1>
      </header>
    )
  }

  renderSearchPosts() {
    const { postsArr, blogs, currentUser, createFollow, openDrawer } = this.props;
    const view = 'searchPosts';

    return (
      <section className='search-posts-container'>
        {/* <div className='search-posts-controls'></div> */}
        <PostIndexMasonry
          view={view}
          postsArr={postsArr}
          blogs={blogs}
          currentUser={currentUser}
          createFollow={createFollow}
          openDrawer={openDrawer} />
      </section>
    )
  }

  componentDidMount() {
    const { query } = this.props.match.params;
    const { fetchSearchPosts } = this.props;
    fetchSearchPosts(query);
  }

  componentWillReceiveProps(newProps) {
    // when user enters new search query on search page
    if (newProps.match.params.query !== this.props.match.params.query) {
      const { fetchSearchPosts, clearSearchPosts } = this.props;
      clearSearchPosts(); // clear previous search results first
      fetchSearchPosts(newProps.match.params.query);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);