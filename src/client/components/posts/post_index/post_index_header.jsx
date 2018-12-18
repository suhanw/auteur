import React from 'react';
import PostMenu from './post_menu';
import PostFormContainer from '../post_forms/post_form_container';

class PostIndexHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPostForm: null,
    };

    this.togglePostForm = this.togglePostForm.bind(this);
  }

  render() {
    let headerComponent;
    if (this.state.showPostForm) {
      headerComponent = (
        <PostFormContainer formType={this.state.showPostForm}
          togglePostForm={this.togglePostForm} />
      );
    } else {
      headerComponent = (
        <PostMenu togglePostForm={this.togglePostForm} />
      );
    }
    return (
      <header className='post-index.header'>
        {headerComponent}
      </header>
    );
  }

  togglePostForm(formType) {
    const { showPostForm } = this.state;
    let newValue
    if (!showPostForm) {
      newValue = formType;
    } else {
      newValue = null;
    }
    this.setState({ showPostForm: newValue });
  }
}

export default PostIndexHeader;