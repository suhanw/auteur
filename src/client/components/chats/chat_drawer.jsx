import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { GlobalContext } from '../global_ context_provider';
import { selectChatDrawers } from '../../selectors/selectors';
import { closeChatDrawer } from '../../actions/chat_actions';

const mapStateToProps = (state, _) => {
  const chatDrawers = selectChatDrawers(state);
  return {
    chatDrawers,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    closeChatDrawer: (chatDrawer) => dispatch(closeChatDrawer(chatDrawer)),
  };
};

class ChatDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newChatMessage: '',
    };

    this.socket = null;

    this.activeChatRef = React.createRef();

    this.renderActiveChat = this.renderActiveChat.bind(this);
    this.renderChatMessages = this.renderChatMessages.bind(this);
    this.renderChatMessage = this.renderChatMessage.bind(this);
    this.renderChatMessageForm = this.renderChatMessageForm.bind(this);
    this.renderMinimizedChats = this.renderMinimizedChats.bind(this);
    this.renderMinimizedChatAvatar = this.renderMinimizedChatAvatar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resizeChatMessageInput = this.resizeChatMessageInput.bind(this);
    this.closeActiveChat = this.closeActiveChat.bind(this);
  }

  render() {
    return (
      <aside className='chat-drawer'>
        {this.renderActiveChat()}
        {this.renderMinimizedChats()}
      </aside>
    );
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:3000');
  }

  componentWillUnmount() {
    this.socket.disconnect(true);
  }

  renderActiveChat() {
    // if (!this.props.chatDrawers.activeChat) return null;
    const { currentUser } = this.context;
    if (!currentUser) return null; // delete later
    return (
      <section className='active-chat chat-slide-up'
        ref={this.activeChatRef}>
        <header className='active-chat-header'>
          <span>
            {currentUser.username}
          </span>
          <i className="fas fa-chevron-circle-down"></i>
          <i className="fas fa-times"
            onClick={this.closeActiveChat}></i>
        </header>
        {this.renderChatMessages()}
        {this.renderChatMessageForm()}
      </section>
    );
  }

  renderChatMessages() {
    // TESTING
    let author = {
      username: 'suhan',
      avatarImageUrl: 'https://res.cloudinary.com/allamerican/image/fetch/t_face_s270/https://speakerdata2.s3.amazonaws.com/photo/image/884111/2f72417d5d6a580ab37a4d925c9e3a8d.jpg'
    };
    let message = { _id: 'test', body: 'test' };
    // TESTING
    let chatMessages = [
      this.renderChatMessage(author, message),
    ];
    return (
      <div className='scrolling-container'>
        <ul className='active-chat-messages'>
          {chatMessages}
        </ul>
      </div>
    );
  }

  renderChatMessage(author, message) {
    return (
      <li key={message._id} className='chat-message'>
        <div className='chat-message-avatar'>
          <div className='avatar avatar-extra-small'
            style={{ backgroundImage: `url(${author.avatarImageUrl})` }}></div>
        </div>
        <section className='chat-message-content'>
          <div className='chat-message-username'>{author.username}</div>
          <div className='chat-message-body'>{message.body}</div>
        </section>
      </li>
    )
  }

  renderChatMessageForm() {
    return (
      <form className='chat-message-form'>
        <div className='chat-message-input'>
          <textarea type='text'
            name='message'
            placeholder='Say your thing'
            autoFocus={true}
            value={this.state.newChatMessage}
            onChange={this.handleChange} />
        </div>
        <div className='chat-message-submit'>
          <button type='submit'
            className="far fa-paper-plane"></button>
        </div>
      </form>
    )
  }

  renderMinimizedChats() {
    // TESTING
    let chatPartner = {
      avatarImageUrl: 'https://res.cloudinary.com/allamerican/image/fetch/t_face_s270/https://speakerdata2.s3.amazonaws.com/photo/image/884111/2f72417d5d6a580ab37a4d925c9e3a8d.jpg'
    }
    // TESTING
    let minimizedChatAvatars = [
      this.renderMinimizedChatAvatar(chatPartner),
      this.renderMinimizedChatAvatar(chatPartner),
    ];
    return (
      <ul className='minimized-chats'>
        {minimizedChatAvatars}
      </ul>
    );
  }

  renderMinimizedChatAvatar(chatPartner) {
    return (
      <li className='avatar avatar-small'
        style={{ backgroundImage: `url(${chatPartner.avatarImageUrl})` }}>
      </li>
    );
  }

  handleChange(e) {
    this.setState({ newChatMessage: e.currentTarget.value });
    e.persist();
    this.resizeChatMessageInput(e);
  }

  resizeChatMessageInput(e) {
    // textLength for a full row is 46px
    let rows = Math.ceil(e.currentTarget.textLength / 46);
    // height of a row is 16px
    let newHeight = rows * 16 || 16; // if there are zero rows, min height is 16px
    e.currentTarget.style.height = `${newHeight}px`;
  }

  closeActiveChat(e) {
    this.activeChatRef.current.classList.add('chat-slide-down');
    // setTimeout to dispatch redux action to nullify activeChat
    let animateCloseChatDrawerTimer = setTimeout(
      () => {
        clearTimeout(animateCloseChatDrawerTimer);
        animateCloseChatDrawerTimer = null;
        this.props.closeChatDrawer('test');
      },
      200
    );
  }
}

ChatDrawer.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatDrawer);