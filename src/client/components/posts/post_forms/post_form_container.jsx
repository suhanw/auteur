import React from 'react';
import { connect } from 'react-redux';

import { selectCurrentUser, selectBlog } from '../../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  const formType = ownProps.match.params.type;
  return {
    currentUser,
    formType,
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
    const { formType } = this.props;
    return (
      <div>This is PostForm for {formType}.</div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
