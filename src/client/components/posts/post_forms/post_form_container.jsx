import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
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

    this.state = {
      closeForm: false,
    }

    this.renderPostFormType = this.renderPostFormType.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
  }

  render() {
    // to close the form
    if (this.state.closeForm) return <Redirect to='/dashboard' />;

    const { formType, postModal } = this.props;
    return (
      <div className='post-form-container'>
        <div className='background-greyout'></div>
        {this.renderPostFormType()}
      </div>
    );
  }

  renderPostFormType() {
    const { formType } = this.props;
    const postFormComponents = {
      'text': PostFormText,
    }
    const Component = postFormComponents[formType];
    return <Component />;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.closePostForm);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closePostForm);
  }

  closePostForm(e) {
    if (e.code === 'Escape') {
      this.setState({ closeForm: true });
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
