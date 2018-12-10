import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormText extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? merge({}, props.post) : {
      type: 'text',
      title: '',
      body: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { blog, confirmDiscardPost, errorMessage } = this.props;
    const { title, body } = this.state;
    const readyToSubmit = (title === '') ? false : true;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <fieldset className='post-main'>
          <input type='text'
            className='post-title'
            name='title'
            value={title}
            placeholder='Title'
            autoFocus={true}
            onChange={this.handleChange('title')} />
          <ContentEditable className='post-body'
            html={body}
            disabled={false}
            onChange={this.handleChange('body')}
            placeholder='Your text here.'
            tagName='div' />
        </fieldset>

        {errorMessage}

        <PostFormFooter
          confirmDiscardPost={confirmDiscardPost}
          readyToSubmit={readyToSubmit} />

      </form>
    );
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
      (errAction) => {
        if (errAction) return; // if a post error is received, do nothing
        closePostForm(e); // otherwise, close form after posting
      }
    );
  }
}

export default PostFormText;