import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge } from 'lodash';

class PostFormText extends React.Component {
  constructor(props) {
    super(props);

    // state represents the new Post
    this.state = {
      title: '',
      body: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className='post-main'>
        <input type='text'
          className='post-title'
          name='title'
          value={this.state.title}
          placeholder='Title'
          onChange={this.handleChange('title')} />
        <ContentEditable className='post-body'
          html={this.state.body}
          disabled={false}
          onChange={this.handleChange('body')}
          placeholder='Your text here.'
          tagName='div' />
      </div>
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
}

export default PostFormText;