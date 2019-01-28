import React from 'react';
import { connect } from 'react-redux';

import PostIndexMasonry from '../posts/post_index/post_index_masonry';
import { PostSpinner } from '../spinners/spinners';
import { selectPosts, selectBlogs, selectLoadingSearchPosts } from '../../selectors/selectors';
import { fetchSearchPosts, clearSearchPosts } from '../../actions/search_actions';
import { createFollow } from '../../actions/follow_actions';
import { openDrawer } from '../../actions/drawer_actions';
import { toggleClass } from '../../util/misc_util';

const mapStateToProps = (state, _) => {
  return {
    postsArr: selectPosts(state, 'searchPosts'),
    blogs: selectBlogs(state),
    loadingSearchPosts: selectLoadingSearchPosts(state),
  };
};

const mapDispatchToProps = (dispatch, _) => {
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

    this.state = {
      noPostResults: false,
      masonryCols: 4,
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderSearchPosts = this.renderSearchPosts.bind(this);
    this.throttleResizeNavbar = this.throttleResizeNavbar.bind(this);
    this.renderPerScreenSize = this.renderPerScreenSize.bind(this);
  }

  render() {
    const { loadingSearchPosts } = this.props;

    return (
      <div className='search-page'>
        <div className='search-page-content'>
          {this.renderHeader()}

          {/* {this.renderSearchBlogs()} */}
          {this.renderSearchPosts()}

          {loadingSearchPosts && <PostSpinner spinnerClass='loading-search-posts' />}

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
    const { noPostResults } = this.state;
    if (noPostResults) {
      return (
        <div className='post-blank' >
          <img className='not-found-icon' src='images/notFound.png' />
          No posts found.
        </div >
      );
    }

    const { postsArr, blogs, createFollow, openDrawer } = this.props;
    const view = 'searchPosts';

    return (
      <section className='search-posts-container'>
        {/* <div className='search-posts-controls'></div> */}
        <PostIndexMasonry
          masonryCols={this.state.masonryCols}
          view={view}
          postsArr={postsArr}
          blogs={blogs}
          createFollow={createFollow}
          openDrawer={openDrawer} />
      </section>
    )
  }

  componentDidMount() {
    const { query } = this.props.match.params;
    const { fetchSearchPosts } = this.props;
    fetchSearchPosts(query).then(
      (posts) => {
        if (posts.length) this.setState({ noPostResults: false });
        else this.setState({ noPostResults: true });
      }
    );

    this.renderPerScreenSize();
    window.addEventListener('resize', this.throttleResizeNavbar());
  }

  componentWillUnmount() {
    this.props.renderNavbar(null); // to remove navbar when unmounting
    window.removeEventListener('resize', this.throttleResizeNavbar());
  }

  componentWillReceiveProps(newProps) {
    // when user enters new search query on search page
    if (newProps.match.params.query !== this.props.match.params.query) {
      const { fetchSearchPosts, clearSearchPosts } = this.props;
      clearSearchPosts(); // clear previous search results first
      fetchSearchPosts(newProps.match.params.query).then(
        (posts) => {
          if (posts.length) this.setState({ noPostResults: false });
          else this.setState({ noPostResults: true });
        }
      );
    }
  }

  throttleResizeNavbar() {
    let resizeTimeout;
    const that = this;
    return function (e) {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(
          () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = null;
            that.renderPerScreenSize()
          },
          1000);
      }
    };
  }

  renderPerScreenSize() {
    if (window.innerWidth <= 812) {
      this.props.renderNavbar({ view: 'navbarMobile' });
      this.setState({ masonryCols: 1 });
    } else if (window.innerWidth <= 960) {
      this.props.renderNavbar({ view: 'navbarMain' });
      this.setState({ masonryCols: 2 });
    } else if (window.innerWidth <= 1280) {
      this.props.renderNavbar({ view: 'navbarMain' });
      this.setState({ masonryCols: 3 });
    } else {
      this.props.renderNavbar({ view: 'navbarMain' });
      this.setState({ masonryCols: 4 });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);