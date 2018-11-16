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
      newForm: {
        title: '',
        body: '',
      }
    };

    this.renderPostForm = this.renderPostForm.bind(this);
    this.closePostForm = this.closePostForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        <form className='post-form' onSubmit={this.handleSubmit}>
          <header className='post-header'>{!blog ? 'Loading blog...' : blog.name}</header>
          {this.renderPostForm()}
          <footer className='post-footer'>Footer</footer>
        </form>
      </div>
    );
  }


  handleSubmit(e) {
    e.preventDefault();
    console.log('this will handle submit');
  }

  renderPostForm() {
    const { formType } = this.props;
    const { title, body } = this.state;
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
