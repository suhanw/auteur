import React from 'react';
import ContentEditable from 'react-contenteditable';
import { merge, union } from 'lodash';

import PostFormHeader from './post_form_header';
import PostFormFooter from './post_form_footer';

class PostFormPhoto extends React.Component {
  constructor(props) {
    super(props);

    // populate state for edit form (i.e., post is not null), otherwise state is blank for new form
    this.state = props.post ? props.post : {
      type: 'photo',
      body: '',
      media: [],
      mediaFilenames: [],
      mediaPreview: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMediaFiles = this.handleMediaFiles.bind(this);
    this.renderMediaPreview = this.renderMediaPreview.bind(this);
  }

  render() {
    const { blog, closePostForm } = this.props;
    // const { title, body } = this.state;
    const { mediaPreview } = this.state;
    // to show preview when user selects file
    let mediaPreviewImgs = [];
    if (mediaPreview.length > 0) {
      mediaPreviewImgs = mediaPreview.map((mediaPreviewURL) => <img key={mediaPreviewURL} src={mediaPreviewURL} className='post-photo' />);
    }
    return (
      <form className='post-form' onSubmit={this.handleSubmit}>

        <PostFormHeader blog={blog} />

        <main className='post-main'>

          {mediaPreviewImgs}

          <div className='media-upload'>
            <span className='photo-upload'>
              <input
                type='file'
                accept='image/*'
                multiple={true}
                onChange={this.handleMediaFiles} />
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

  renderMediaPreview() {

  }

  handleChange(inputField) {
    const that = this;
    return function (e) {
      let newState = {};
      newState[inputField] = e.target.value;
      that.setState(newState);
    };
  }

  handleMediaFiles(e) {
    const toArray = function (fileList) {
      return Array.prototype.slice.call(fileList);
    }
    const mediaFiles = toArray(e.target.files); // to convert FileList to Array
    let media = this.state.media.slice(); // copy state
    let mediaFilenames = this.state.mediaFilenames.slice() // copy state
    let fileReaders = [];
    let mediaPreview = this.state.mediaPreview.slice();
    if (mediaFiles.length > 0) {
      const that = this;
      mediaFiles.forEach(function (file, i) {
        if (mediaFilenames.indexOf(file.name) >= 0) { //do nothing if a file has been previously selected
          return;
        }
        // To allow user to cumulatively append images
        media.push(file);
        mediaFilenames.push(file.name);
        fileReaders.push(new FileReader());
        fileReaders[i].readAsDataURL(file);
        fileReaders[i].onloadend = function () {
          mediaPreview = union(mediaPreview, [fileReaders[i].result]);
          that.setState({ mediaPreview }, () => console.log(that.state));
        }
      });
    }
    this.setState({ media, mediaFilenames }, () => (console.log(this.state)));
    // FIX: add loader for preview images
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
    submitAction(newPost).then(
      () => closePostForm(e) // close form after posting
    );
  }
}

export default PostFormPhoto;