import React from 'react';
import { connect } from 'react-redux';

import PostIndex from './post_index';
import { selectPosts, selectBlogs } from '../../selectors/selectors';
import { fetchPosts } from '../../actions/post_actions';

const mapStateToProps = function (state, ownProps) {
  const postsArr = selectPosts(state);
  const blogs = selectBlogs(state);
  return {
    postsArr,
    blogs,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {

  return {
    fetchPosts: () => dispatch(fetchPosts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);