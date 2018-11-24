import React from 'react';

class AccountPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='account-popover popover'>
        <section className='popover-subsection'>
          <header className='popover-header'>
            <span>Account</span>
            <span className='popover-item-suffix'>Log out</span>
          </header>
          <ul>
            <li className='popover-menu-item'>
              <span>Likes</span>
              <span className='popover-item-suffix'>count</span>
            </li>
            <li className='popover-menu-item'>
              <span>Following</span>
              <span className='popover-item-suffix'>count</span>
            </li>
            <li className='popover-menu-item'>
              <span>Settings</span>
              <span className='popover-item-suffix'>count</span>
            </li>
          </ul>
        </section>
        <section className='popover-subsection'>
          <header className='popover-header'>
            Blogs
          </header>
          <ul>
            <li className='popover-menu-item'>
              <div className='blog-item'>
                <div className='blog-item-info'>
                  <img className='avatar avatar-small' />
                  <div className='blog-item-details'>
                    <span className='blog-item-details-name'>blog name</span>
                    <span className='blog-item-details-title'>blog title</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}

export default AccountPopover;