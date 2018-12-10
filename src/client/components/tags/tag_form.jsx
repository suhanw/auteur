import React from 'react';

class TagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: ['tag1', 'tag2'],
      // tags: [],
    };

    this.renderTagInput = this.renderTagInput.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  render() {

    return (
      <div className='tag-form'>
        {this.renderTags()}
        {this.renderTagInput()}
      </div>
    );
  }

  renderTagInput() {
    const { tags } = this.state;
    let placeholderValue = (tags.length) ? '' : '#tags';
    return (
      <input className='tag-input'
        type='text'
        placeholder={placeholderValue}
      />
    )
  }

  renderTags() {
    // FIX: make tags draggable
    const { tags } = this.state;
    if (!tags.length) return null;
    let tagList = tags.map((tagLabel) => {
      return <span className='tag-label'>
        {`#${tagLabel}`}
      </span>
    });
    return tagList;
  }

  addTag(newTagLabel) {
    let newState = merge({}, this.state);
    newState.tags.push(newTagLabel);
    this.setState(newState);
  }

  removeTag(removedTagLabel) {
    let newState = merge({}, this.state);
    newState.tags = this.state.tags.filter((tagLabel) => tagLabel !== removedTagLabel);
    this.setState(newState);
  }
}

export default TagForm;