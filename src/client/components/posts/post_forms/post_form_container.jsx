import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import { selectCurrentUser, selectBlog } from '../../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  const formType = ownProps.match.params.type;
  const blog = selectBlog(state, currentUser.primaryBlog);
  return {
    currentUser,
    formType,
    blog,
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
    };

    this.renderPostForm = this.renderPostForm.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
  }

  render() {
    // to close the form
    if (this.state.closeForm) return <Redirect to='/dashboard' />;

    const { blog, currentUser } = this.props;
    return (
      <div className='post-form-container'>
        <div className='background-greyout'></div>
        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={currentUser.avatarImageUrl} />
        </picture>
        {this.renderPostForm()}
      </div>
    );
  }


  renderPostForm() {
    const { formType, blog } = this.props;
    const postFormComponents = {
      'text': PostFormText,
    }
    const Component = postFormComponents[formType];
    return <Component blog={blog} closePostForm={this.closePostForm} />;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.closePostForm);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closePostForm);
  }

  closePostForm(e) {
    if (e.type === 'click' || // when user clicks 'Close' button
      (e.type === 'keydown' && e.code === 'Escape')) { // when user hits Esc key
      this.setState({ closeForm: true });
      return;
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
