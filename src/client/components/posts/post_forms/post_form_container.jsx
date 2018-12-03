import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import PostFormPhoto from './post_form_photo';
import PostFormQuote from './post_form_quote';
import PostFormLink from './post_form_link';
import PostFormAudio from './post_form_audio';
import PostFormVideo from './post_form_video';
import { fetchBlog } from '../../../actions/blog_actions';
import { createPost, updatePost } from '../../../actions/post_actions';
import { selectCurrentUser, selectBlog, selectLoadingPostSubmit } from '../../../selectors/selectors';
import { renderSpinner } from '../../../util/misc_util';

const mapStateToProps = function (state, ownProps) {
  let formType; // whether it's text, photo, video, etc
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  const loadingPostSubmit = selectLoadingPostSubmit(state);
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
    loadingPostSubmit,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
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

    const { currentUser, loadingPostSubmit } = this.props;
    const spinnerClass = loadingPostSubmit ? 'loading-post-submit' : null;
    return (
      <div className='post-form-container'>
        {/* to grey out dashboard when PostForm is opened */}
        <div className='background-greyout'
          tabIndex='0'
          onKeyDown={this.closePostForm}></div>

        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={currentUser.avatarImageUrl} />
        </picture>


        <div className='post-form-wrapper'
          tabIndex='0'
          onKeyDown={this.closePostForm}>
          {this.renderPostFormType()}
          {renderSpinner(spinnerClass)}
        </div>

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
      'quote': PostFormQuote,
      'link': PostFormLink,
      'audio': PostFormAudio,
      'video': PostFormVideo,
    };
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
    // FIX: USE REFS
    // window.addEventListener('keydown', this.closePostForm);
  }

  componentWillUnmount() {
    // window.removeEventListener('keydown', this.closePostForm);
  }

  closePostForm(e) {
    // FIX: add modal for user to confirm discard edit changes
    if (e.type !== 'keydown' || // when user clicks 'Close' button
      (e.type === 'keydown' && e.key === 'Escape')) { // when user hits Esc key
      this.setState({ closeForm: true });
      return;
    }
  }

  toggleBlog() {
    // FIX: in future, create a toggleBlog func that changes blog id in state 
    // and pass into PostFormType. User may have multiple blogs.
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
