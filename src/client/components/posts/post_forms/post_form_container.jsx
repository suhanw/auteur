import React from 'react';
import { connect } from 'react-redux';

import { selectCurrentUser, selectBlog } from '../../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id

  return {
    currentUser,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // need createPost
  // need updatePost
  // need fetchPost
  return {
    createPost: () => { },
  }
};



class PostForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>This is PostForm.</div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
