import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import PostFormText from './post_form_text';
import { fetchBlog } from '../../../actions/blog_actions';
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
    fetchBlog: (blogId) => dispatch(fetchBlog(blogId)),
    createPost: () => { },
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
    // to close the form
    if (this.state.closeForm) return <Redirect to='/dashboard' />;

    const { currentUser } = this.props;
    return (
      <div className='post-form-container'>
        <div className='background-greyout'></div>
        <picture className='avatar-container'>
          <img className='avatar avatar-default' src={currentUser.avatarImageUrl} />
        </picture>
        {this.renderPostFormType()}
      </div>
    );
  }


  renderPostFormType() {
    const { formType } = this.props;
    const { blog } = this.state;
    const postFormComponents = {
      'text': PostFormText,
    }
    const Component = postFormComponents[formType];
    return <Component
      blog={blog}
      closePostForm={this.closePostForm} />;
  }

  componentDidMount() {
    const { currentUser, fetchBlog } = this.props;
    const { blog } = this.state;
    window.addEventListener('keydown', this.closePostForm);
    if (!blog) { //if blog not already in Redux state, fetch blog
      fetchBlog(currentUser.primaryBlog).then(
        (result) => {
          const { payload: { _id, name, avatarImageUrl } } = result;
          this.setState({ blog: { _id, name, avatarImageUrl } });
        }
      );
    }
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

  toggleBlog() {
    // NOTE: in future, create a toggleBlog func that changes blog id in state 
    // and pass into PostFormType.
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
