import React from 'react';
import { connect } from 'react-redux';

import PostFormText from './post_form_text';
import PostFormPhoto from './post_form_photo';
import PostFormQuote from './post_form_quote';
import PostFormLink from './post_form_link';
import PostFormAudio from './post_form_audio';
import PostFormVideo from './post_form_video';
import Modal from '../../modals/modal';
import { fetchBlog } from '../../../actions/blog_actions';
import { createPost, updatePost } from '../../../actions/post_actions';
import { clearErrors } from '../../../actions/clear_actions';
import { selectCurrentUser, selectBlog, selectLoadingPostSubmit, selectPostErrors } from '../../../selectors/selectors';
import { renderSpinner } from '../../../util/misc_util';
import { ErrorMessage } from '../../errors/errors';


const mapStateToProps = function (state, ownProps) {
  let formType; // whether it's text, photo, video, etc
  const currentUser = selectCurrentUser(state); //this includes primaryBlog id
  const loadingPostSubmit = selectLoadingPostSubmit(state);
  const postErrors = selectPostErrors(state);
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
    postErrors,
    togglePostForm,
  }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    createPost: (post) => dispatch(createPost(post)),
    updatePost: (post) => dispatch(updatePost(post)),
    clearErrors: () => dispatch(clearErrors()),
  };
};



class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDiscardPostModal: false,
    };

    this.postFormComponents = {
      'text': PostFormText,
      'photo': PostFormPhoto,
      'quote': PostFormQuote,
      'link': PostFormLink,
      'audio': PostFormAudio,
      'video': PostFormVideo,
    };

    this.renderPostFormType = this.renderPostFormType.bind(this);
    this.renderConfirmModal = this.renderConfirmModal.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
    this.confirmDiscardPost = this.confirmDiscardPost.bind(this);
  }

  render() {
    const { currentUser, loadingPostSubmit, postErrors } = this.props;
    const spinnerClass = loadingPostSubmit ? 'loading-post-submit' : null;
    return (
      <div className='post-form-container'>

        {this.renderConfirmModal()}

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

  renderConfirmModal() {
    // to render confirm modal when user close form without posting
    const { edit } = this.props;
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

    return (
      <Modal localModal={localModal}
        closeModal={closeModal} />
    )
  }

  renderPostFormType() {
    const {
      formType,
      currentUser,
      blog,
      post,
      createPost,
      updatePost,
      postErrors,
    } = this.props;

    const PostFormComponent = this.postFormComponents[formType];
    const errorMessage = <ErrorMessage errorArr={postErrors} />;
    // if post is null, pass in createPost for 'new' form, else, pass in updateForm for 'edit' form
    let submitAction = (!post) ? createPost : updatePost;

    return <PostFormComponent
      currentUser={currentUser}
      blog={blog}
      post={post}
      confirmDiscardPost={this.confirmDiscardPost}
      closePostForm={this.closePostForm}
      submitAction={submitAction}
      errorMessage={errorMessage} />;
  }

  confirmDiscardPost() {
    this.setState({
      confirmDiscardPostModal: true
    });
  }

  closePostForm(e) {
    if (e && e.type === 'keydown' && e.key !== 'Escape') return; // do not close post form if user hits other keys but Esc
    const { togglePostForm, postErrors, clearErrors } = this.props;
    if (postErrors.length > 0) clearErrors();
    togglePostForm();
  }

  toggleBlog() {
    // FIX: in future, create a toggleBlog func that changes blog id in state 
    // and pass into PostFormType. User may have multiple blogs.
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);