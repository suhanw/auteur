import React from 'react';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormVideo extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? merge({}, props.post) : {
      type: 'text',
      title: '',
      body: '',
    };

    this.mainRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    const { title, body } = this.state;
    const readyToSubmit = (title === '' && body === '') ? false : true;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <span className='post-main'
          tabIndex='0'
          ref={this.mainRef}>
          Working on it! Stay tuned!
        </span>

        <PostFormFooter
          closePostForm={closePostForm}
          readyToSubmit={readyToSubmit} />

      </form>
    );
  }

  componentDidMount() {
    this.mainRef.current.focus();
  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData();
    for (let key in this.state) {
      newPost.append(key, this.state[key]);
    }
    if (!this.state._id) { // for new posts, state does not include author and blog
      newPost.append('author', currentUser._id);
      newPost.append('blog', blog._id);
    }

    submitAction(newPost).then( // invoke AJAX to create new post or edit post
      () => closePostForm(e) // close form after posting
    );
  }
}

export default PostFormVideo;