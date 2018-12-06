import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import PostFormPhoto from './post_form_photo';
import PostFormQuote from './post_form_quote';
import PostFormLink from './post_form_link';
import PostFormAudio from './post_form_audio';
import PostFormVideo from './post_form_video';
import Modal from '../../modals/modal';
import { fetchBlog } from '../../../actions/blog_actions';
import { createPost, updatePost } from '../../../actions/post_actions';
import { selectCurrentUser, selectBlog, selectLoadingPostSubmit } from '../../../selectors/selectors';
import { renderSpinner } from '../../../util/misc_util';

const mapStateToProps = function (state, ownProps) {
  let formType; // whether it's text, photo, video, etc
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  const loadingPostSubmit = selectLoadingPostSubmit(state);
  const { edit, togglePostForm } = ownProps;
  let blog;
  let post;

  if (edit) { // props when it's edit form
    formType = ownProps.post.type;
    blog = ownProps.blog;
    post = ownProps.post;
  } else { // props when it's new form
    formType = ownProps.formType;
    blog = selectBlog(state, currentUser.primaryBlog);
    post = null;
  }

  return {
    currentUser,
    formType,
    blog,
    post,
    loadingPostSubmit,
    togglePostForm,
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
      confirmDiscardPostModal: false,
    };

    // object that stores all the different PostForm types
    this.postFormComponents = {
      'text': PostFormText,
      'photo': PostFormPhoto,
      'quote': PostFormQuote,
      'link': PostFormLink,
      'audio': PostFormAudio,
      'video': PostFormVideo,
    };

    this.renderPostFormType = this.renderPostFormType.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
    this.confirmDiscardPost = this.confirmDiscardPost.bind(this);
  }

  render() {
    const { currentUser, loadingPostSubmit, edit } = this.props;
    const spinnerClass = loadingPostSubmit ? 'loading-post-submit' : null;
    const { confirmDiscardPostModal } = this.state;
    let localModal = null;
    let closeModal;
    if (confirmDiscardPostModal) {
      localModal = {
        action: `confirmDiscardPost${(edit) ? 'Edit' : 'New'}`,
        localAction: this.closePostForm,
      };
      closeModal = () => this.setState({ confirmDiscardPostModal: false });
    }
    console.log('localModal', localModal);
    return (
      <div className='post-form-container'>
        <Modal localModal={localModal}
          closeModal={closeModal} />
        {/* to grey out dashboard when PostForm is opened */}
        <div className='background-greyout'
          tabIndex='0'
          onKeyDown={this.closePostForm}></div>

        <picture className='avatar-container'>
          <div className='avatar avatar-default'
            style={{ backgroundImage: `url(${currentUser.avatarImageUrl})` }} />
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
    const { formType, createPost, updatePost, currentUser, blog, post } = this.props;
    // const { blog, post } = this.state;

    const PostFormComponent = this.postFormComponents[formType];

    // if post is null, pass in createPost for 'new' form, else, pass in updateForm for 'edit' form
    let submitAction = (!post) ? createPost : updatePost;

    return <PostFormComponent
      currentUser={currentUser}
      blog={blog}
      post={post}
      confirmDiscardPost={this.confirmDiscardPost}
      closePostForm={this.closePostForm}
      submitAction={submitAction} />;
  }

  componentDidMount() {
    const { currentUser, fetchBlog, blog } = this.props;
    //if blog not already in Redux state, fetch blog
    if (!blog) {
      fetchBlog(currentUser.primaryBlog).then(
        (result) => {
          const { payload: { _id, name, avatarImageUrl } } = result;
          this.setState({ blog: { _id, name, avatarImageUrl } });
        }
      );
    }
  }

  confirmDiscardPost() {
    this.setState({
      confirmDiscardPostModal: true
    });
  }

  closePostForm(e) {
    const { togglePostForm } = this.props;
    if (e && e.type === 'keydown' && e.key !== 'Escape') { // only close post form when user hits Esc key
      return;
    }
    togglePostForm();
  }

  toggleBlog() {
    // FIX: in future, create a toggleBlog func that changes blog id in state 
    // and pass into PostFormType. User may have multiple blogs.
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);

