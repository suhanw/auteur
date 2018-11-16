import React from 'react';
import ContentEditable from 'react-contenteditable';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormText extends React.Component {
  constructor(props) {
    super(props);

    // state represents the new Post
    this.state = {
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
    console.log(this.state);

    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('this will handle submit');
  }
}

export default PostFormText;