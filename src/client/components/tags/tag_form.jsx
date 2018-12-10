import React from 'react';

class TagForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTag: null,
      newTag: '',
    };

    this.tagInputRef = React.createRef();

    this.renderTagInput = this.renderTagInput.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.toggleHoverTag = this.toggleHoverTag.bind(this);
    this.toggleActiveTag = this.toggleActiveTag.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTagInputKeydown = this.handleTagInputKeydown.bind(this);
    this.handleTagLabelKeydown = this.handleTagLabelKeydown.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  render() {

    return (
      <div className='tag-form'>
        {this.renderTagInput()}
        {this.renderTags()}
      </div>
    );
  }

  renderTagInput() {
    const { newTag } = this.state;
    const { tags } = this.props;
    let placeholderValue = (tags.length) ? '' : '#tags';
    return (
      <input className='tag-input'
        type='text'
        placeholder={placeholderValue}
        value={newTag}
        ref={this.tagInputRef}
        onChange={this.handleChange}
        onKeyDown={this.handleTagInputKeydown}
      />
    )
  }

  renderTags() {
    // FIX: make tags draggable
    const { activeTag } = this.state;
    const { tags } = this.props;
    if (!tags.length) return null;
    let tagList = tags.map((tagLabel) => {
      let active = (activeTag === tagLabel) ? 'active' : '';
      let removeTag = (activeTag === tagLabel) ? this.handleTagLabelKeydown(tagLabel) : null; // only allow user to delete selected tag
      return (
        <span className={`tag-label ${active}`}
          key={tagLabel}
          tabIndex='0' // to enable onKeyDown
          onClick={this.toggleActiveTag(tagLabel)}
          onMouseEnter={this.toggleHoverTag}
          onMouseLeave={this.toggleHoverTag}
          onKeyDown={removeTag}>
          {`#${tagLabel}`}
        </span>
      );
    });
    return tagList.reverse(); // reversing order with css to preserve tab order on tag input
  }

  toggleActiveTag(tagLabel) {
    return (e) => {
      e.preventDefault();
      const { activeTag } = this.state;
      let newState = {};
      newState.activeTag = (activeTag === tagLabel) ? null : tagLabel;
      this.setState(newState);
    };
  }

  toggleHoverTag(e) {
    if (e.type === 'mouseenter') e.currentTarget.classList.add('hover');
    else e.currentTarget.classList.remove('hover');
  }

  handleChange(e) {
    let valueWidth = (e.currentTarget.value.length * 8) + 10; // each letter is 8px wide, accounting for 5px margin on left & right
    let tagInputWidth = (valueWidth > 50) ? valueWidth : 50; // min of 50px width
    e.currentTarget.style.width = `${tagInputWidth}px`; // increase width as user enters value
    let newState = { newTag: e.currentTarget.value };
    this.setState(newState);
  }

  handleTagInputKeydown(e) {
    const { newTag } = this.state;
    const { tags } = this.props;
    if ((e.key === 'Enter' || e.key === 'Tab') && newTag.length) { //only add tag when there is value in input field
      e.preventDefault(); // to prevent moving focus away from the input field when pressing Tab
      this.addTag();
    } else if (e.key === 'Backspace' && !newTag.length) { // delete last tag only when there is no value in tagInput field
      let lastTag = tags[tags.length - 1];
      this.removeTag(lastTag);
    }
  }

  handleTagLabelKeydown(removedTagLabel) {
    return (e) => {
      if (e.key !== 'Backspace') return; // only remove when user hits Backspace
      this.removeTag(removedTagLabel);
    };
  }

  addTag() {
    const { newTag } = this.state;
    const { tags, setPostTags } = this.props;
    if (!tags.includes(newTag)) {
      tags.push(newTag);
    }
    setPostTags(tags);
    this.setState(
      { newTag: '' }, // clear input field after adding
      () => this.tagInputRef.current.focus() // focus on tagInput after deletion
    );
  }

  removeTag(removedTagLabel) {
    const { tags, setPostTags } = this.props;
    let newTags = tags.filter((tagLabel) => tagLabel !== removedTagLabel);
    setPostTags(newTags);
    this.setState(
      { activeTag: null }, // deselect any active tag after removing
      () => this.tagInputRef.current.focus() // focus on tagInput after deletion
    );
  }
}

export default TagForm;