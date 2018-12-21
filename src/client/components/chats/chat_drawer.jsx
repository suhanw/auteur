import React from 'react';
import { connect } from 'react-redux';

import { GlobalContext } from '../global_ context_provider';
import { selectChatDrawers } from '../../selectors/selectors';

const mapStateToProps = (state, _) => {
  const chatDrawers = selectChatDrawers(state);
  return {
    chatDrawers,
  };
}

class ChatDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.renderActiveChat = this.renderActiveChat.bind(this);
    this.renderMinimizedChats = this.renderMinimizedChats.bind(this);
  }

  render() {
    // if (!this.props.chatDrawers.activeChat) return null;
    return (
      <aside className='chat-drawer'>
        {this.renderActiveChat()}
        {this.renderMinimizedChats()}
      </aside>
    );
  }

  renderActiveChat() {
    const { currentUser } = this.context;
    return (
      <section className='active-chat'>
        <header>{currentUser.username}</header>
      </section>
    );
  }

  renderMinimizedChats() {
    return (
      <section className='minimized-chats'>
      </section>
    );
  }
}

ChatDrawer.contextType = GlobalContext;

export default connect(mapStateToProps, null)(ChatDrawer);