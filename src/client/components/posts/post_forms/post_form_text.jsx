import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormText extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? props.post : {
      type: 'text',
      title: '',
      body: '',
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    const { title, body } = this.state;
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

        <PostFormFooter closePostForm={closePostForm} />

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
    // create newPost obj (get blog._id from props)
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = merge({}, this.state);
    newPost.author = currentUser._id;
    newPost.blog = blog._id;
    // invoke AJAX to create new post
    submitAction(newPost).then(
      () => closePostForm(e) // close form after posting
    );
  }
}

export default PostFormText;