import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormPhoto extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? props.post : {
      type: 'photo',
      body: '',
      media: null,
      mediaPreviewURL: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMediaFile = this.handleMediaFile.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    // const { title, body } = this.state;
    const { mediaPreviewURL } = this.state;
    // to show preview when user selects file
    const mediaPreview = mediaPreviewURL ? <img src={mediaPreviewURL} className='post-photo' /> : null;
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>
          {mediaPreview}
          <div className='media-upload'>
            <span className='photo-upload'>
              <input
                type='file'
                accept='image/*'
                name='photo'
                onChange={this.handleMediaFile} />
            </span>
            <span className='photo-link'>
              Add photos from web
            </span>
          </div>
        </main>

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

  handleMediaFile(e) {
    const mediaFile = e.target.files[0];
    const fileReader = new FileReader();
    if (mediaFile) {
      fileReader.readAsDataURL(mediaFile); // to get URL for media preview
    }
    console.log(fileReader.result);
    const that = this;
    fileReader.addEventListener('load', function () { // readAsDataURL is async, so set state when result returned.
      // FIX: add a loader for preview image
      console.log(fileReader.result);
      that.setState(
        { media: mediaFile, mediaPreviewURL: fileReader.result },
        () => console.log(that.state)
      );
    })

  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist(); // to prevent React synthetic event from nullified, and be able to be passed into closePostForm
    // create newPost obj (get blog._id from props)
    const { currentUser, blog, submitAction, closePostForm } = this.props;
    let newPost = new FormData(this.state);
    newPost.append('author', currentUser._id);
    newPost.append('blog', blog._id);
    newPost.append('body', this.state.body);
    newPost.append('media', this.state.media);
    // invoke AJAX to create new post or edit post
    // submitAction(newPost).then(
    //   () => closePostForm(e) // close form after posting
    // );
  }
}

export default PostFormPhoto;