import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import { fetchBlog } from '../../../actions/blog_actions';
import { createPost } from '../../../actions/post_actions';
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
  // need updatePost
  // need fetchPost
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    createPost: (post) => dispatch(createPost(post)),
  }
};



class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: props.blog,
      closeForm: false,
    };

    this.renderPostFormType = this.renderPostFormType.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
  }

  render() {
    // to 'reactivate' dashboard when user closes out PostForm
    if (this.state.closeForm) return <Redirect to='/dashboard' />;

    const { currentUser } = this.props;
    return (
      <div className='post-form-container'>
        {/* to grey out dashboard when PostForm is opened */}
        <div className='background-greyout'></div>

        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={currentUser.avatarImageUrl} />
        </picture>

        {this.renderPostFormType()}

      </div>
    );
  }


  renderPostFormType() {
    const { formType, createPost, currentUser } = this.props;
    const { blog } = this.state;
    // object that stores all the different PostForm types
    const postFormComponents = {
      'text': PostFormText,
      // 'photo': PostFormPhoto,
    }
    const Component = postFormComponents[formType];
    return <Component
      currentUser={currentUser}
      blog={blog}
      closePostForm={this.closePostForm}
      createPost={createPost} />;
  }

  componentDidMount() {
    const { currentUser, fetchBlog } = this.props;
    const { blog } = this.state;
    //if blog not already in Redux state, fetch blog
    if (!blog) {
      fetchBlog(currentUser.primaryBlog).then(
        (result) => {
          const { payload: { _id, name, avatarImageUrl } } = result;
          this.setState({ blog: { _id, name, avatarImageUrl } });
        }
      );
    }
    // to close form when user presses Esc key.
    window.addEventListener('keydown', this.closePostForm);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closePostForm);
  }

  closePostForm(e) {
    console.log(e.type);

    if (e.type !== 'keydown' ||
      (e.type === 'keydown' && e.code === 'Escape')) { // when user hits Esc key
      this.setState({ closeForm: true });
      return;
    }
  }

  toggleBlog() {
    // NOTE: in future, create a toggleBlog func that changes blog id in state 
    // and pass into PostFormType. User may have multiple blogs.
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
