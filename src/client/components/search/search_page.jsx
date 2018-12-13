import React from 'react';
import { connect } from 'react-redux';

import PostShowItem from '../posts/post_show/post_show_item';
import { selectPosts, selectCurrentUser, selectBlogs } from '../../selectors/selectors';
import { fetchSearchPosts } from '../../actions/search_actions';
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
    createFollow: (blogId) => dispatch(createFollow(blogId)),
    openDrawer: (drawer) => dispatch(openDrawer(drawer)),
  };
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props)

    this.renderHeader = this.renderHeader.bind(this);
    this.renderSearchPosts = this.renderSearchPosts.bind(this);
  }

  render() {

    return (
      <div className='search-page'>
        {this.renderHeader()}
        {/* {this.renderSearchBlogs()} */}
        {this.renderSearchPosts()}
      </div>
    );
  }

  renderHeader() {
    const { query } = this.props.match.params;
    return (
      <div>
        {query.toUpperCase()}
      </div>
    )
  }

  renderSearchPosts() {
    const { postsArr, blogs, currentUser, createFollow, openDrawer } = this.props;
    const view = 'searchPosts';
    let searchPostItems = postsArr.map((post) => {
      let blog = blogs[post.blog];
      return (
        <li key={post._id} >
          <PostShowItem
            view={view}
            post={post}
            blog={blog}
            currentUser={currentUser}
            createFollow={createFollow}
            openDrawer={openDrawer} />
        </li>
      );
    });
    return (
      <ul>
        {searchPostItems}
      </ul>
    );
  }

  componentDidMount() {
    const { query } = this.props.match.params;
    const { fetchSearchPosts } = this.props;
    fetchSearchPosts(query);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);