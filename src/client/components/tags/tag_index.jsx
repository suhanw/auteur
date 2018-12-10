import React from 'react';

class TagIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { postId, tags } = this.props;
    if (!tags.length) return null;
    let tagList = tags.map((tagLabel) => {
      return (
        <li key={`${postId}_${tagLabel}`}
          className='tag-label'>
          {`#${tagLabel}`}
        </li>
      )
    });

    return (
      <ul className='tag-index'>
        {tagList}
      </ul>
    );
  }
}

export default TagIndex; 