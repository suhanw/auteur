import React from 'react';
import { connect } from 'react-redux';

import NavbarContainer from '../navbar/navbar_container';
import PostIndexMasonry from '../posts/post_index/post_index_masonry';
import { PostSpinner } from '../spinners/spinners';
import { selectPosts, selectCurrentUser, selectBlogs, selectLoadingSearchPosts } from '../../selectors/selectors';
import { fetchSearchPosts, clearSearchPosts } from '../../actions/search_actions';
import { createFollow } from '../../actions/follow_actions';
import { openDrawer } from '../../actions/drawer_actions';
import { toggleClass } from '../../util/misc_util';

const mapStateToProps = (state, ownProps) => {
  const postsArr = selectPosts(state, 'searchPosts');
  const blogs = selectBlogs(state);
  const currentUser = selectCurrentUser(state);
  const loadingSearchPosts = selectLoadingSearchPosts(state);
  return {
    postsArr,
    blogs,
    currentUser,
    loadingSearchPosts,
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

    this.state = {
      noPostResults: false,
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderSearchPosts = this.renderSearchPosts.bind(this);
    this.throttleResizeNavbar = this.throttleResizeNavbar.bind(this);
    this.renderNavbarPerScreenSize = this.renderNavbarPerScreenSize.bind(this);
  }

  render() {
    const { loadingSearchPosts } = this.props;

    return (
      <div className='search-page'>
        <NavbarContainer />
        <div className='search-page-content'>
          {this.renderHeader()}

          {/* {this.renderSearchBlogs()} */}
          {this.renderSearchPosts()}

          <PostSpinner spinnerClass={toggleClass(loadingSearchPosts, 'loading-search-posts', null)} />

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

  componentWillMount() {
    // this.renderNavbarPerScreenSize();
    // window.addEventListener('resize', this.throttleResizeNavbar());
  }

  componentWillUnmount() {
    this.props.renderNavbar(null); // to remove navbar when unmounting
    window.removeEventListener('resize', this.throttleResizeNavbar());
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

    this.renderNavbarPerScreenSize();
    window.addEventListener('resize', this.throttleResizeNavbar());
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
            that.renderNavbarPerScreenSize()
          },
          1000);
      }
    };
  }

  renderNavbarPerScreenSize() {
    if (window.innerWidth <= 812) {
      this.props.renderNavbar({ view: 'navbarMobile' });
    } else {
      this.props.renderNavbar({ view: 'navbarMain' });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);