import React from 'react';

class BlogDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        This is {data.name}'s blog'.
      </div>
    )
  }
}

export default BlogDrawer;