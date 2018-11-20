import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import PostFormPhoto from './post_form_photo';
import { fetchBlog } from '../../../actions/blog_actions';
import { createPost, updatePost } from '../../../actions/post_actions';
import { selectCurrentUser, selectBlog } from '../../../selectors/selectors';

const mapStateToProps = function (state, ownProps) {
  let formType; // whether it's text, photo, video, etc
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  let blog;
  let post;

  if (ownProps.edit) { // props when it's edit form
    formType = ownProps.post.type;
    blog = ownProps.blog;
    post = ownProps.post;
  } else { // props when it's new form
    formType = ownProps.match.params.type;
    blog = selectBlog(state, currentUser.primaryBlog);
    post = null;
  }

  return {
    currentUser,
    formType,
    blog,
    post,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  // need updatePost
  // need fetchPost
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    createPost: (post) => dispatch(createPost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
  };
};



class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: props.blog,
      post: props.post,
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
    const { formType, createPost, updatePost, currentUser } = this.props;
    const { blog, post } = this.state;
    // object that stores all the different PostForm types
    const postFormComponents = {
      'text': PostFormText,
      'photo': PostFormPhoto,
    }
    const Component = postFormComponents[formType];

    // if post is null, pass in createPost for 'new' form, else, pass in updateForm for 'edit' form
    let submitAction = (!post) ? createPost : updatePost;

    return <Component
      currentUser={currentUser}
      blog={blog}
      post={post}
      closePostForm={this.closePostForm}
      submitAction={submitAction} />;
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
