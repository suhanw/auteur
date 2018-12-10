import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormQuote extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? merge({}, props.post) : {
      type: 'quote',
      title: '',
      body: '',
    };

    this.quoteFieldRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { blog, confirmDiscardPost, errorMessage } = this.props;
    const { title, body } = this.state;
    const readyToSubmit = (title === '' || body === '') ? false : true;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        {errorMessage}

        <fieldset className='post-main'>
          <div className='post-quote'>
            <ContentEditable
              html={title}
              disabled={false}
              placeholder='Quote'
              onChange={this.handleChange('title')}
              tagName='div'
              tabIndex='0'
              ref={this.quoteFieldRef} />
          </div>
          <span className='post-source'>
            <input type='text'
              className='post-source'
              name='body'
              value={body}
              placeholder='Source'
              onChange={this.handleChange('body')} />
          </span>
        </fieldset>

        <PostFormFooter
          confirmDiscardPost={confirmDiscardPost}
          readyToSubmit={readyToSubmit} />

      </form>
    );
  }

  componentDidMount() {
    this.quoteFieldRef.current.getEl().focus();
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

export default PostFormQuote;