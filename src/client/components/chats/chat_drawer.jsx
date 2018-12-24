import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { GlobalContext } from '../global_ context_provider';
import { selectChatDrawers, selectChatRooms, selectChatMessages, selectUsers } from '../../selectors/selectors';
import { closeChatDrawer, fetchChatRoom, createChatRoom, fetchChatMessage, createChatMessage } from '../../actions/chat_actions';

const mapStateToProps = (state, _) => {
  const chatDrawers = selectChatDrawers(state);
  const chatRooms = selectChatRooms(state);
  const chatMessages = selectChatMessages(state);
  const users = selectUsers(state);
  return {
    chatDrawers,
    chatRooms,
    chatMessages,
    users,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    closeChatDrawer: (chatDrawer) => dispatch(closeChatDrawer(chatDrawer)),
    fetchChatRoom: (chatPartner) => dispatch(fetchChatRoom(chatPartner)),
    createChatRoom: (chatPartner) => dispatch(createChatRoom(chatPartner)),
    fetchChatMessage: (chatPartner, chatRoomId) => dispatch(fetchChatMessage(chatPartner, chatRoomId)),
    createChatMessage: (chatPartner, chatMessage) => dispatch(createChatMessage(chatPartner, chatMessage)),
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
    this.scrollingContainerRef = React.createRef();

    this.renderActiveChat = this.renderActiveChat.bind(this);
    this.renderChatMessages = this.renderChatMessages.bind(this);
    this.renderChatMessage = this.renderChatMessage.bind(this);
    this.renderChatMessageForm = this.renderChatMessageForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderMinimizedChats = this.renderMinimizedChats.bind(this);
    this.renderMinimizedChatAvatar = this.renderMinimizedChatAvatar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resizeChatMessageInput = this.resizeChatMessageInput.bind(this);
    this.closeActiveChat = this.closeActiveChat.bind(this);
    this.animateChatTransition = this.animateChatTransition.bind(this);
    this.createChatSocket = this.createChatSocket.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  render() {
    return (
      <aside className='chat-drawer'>
        {this.renderActiveChat()}
        {this.renderMinimizedChats()}
      </aside>
    );
  }

  componentWillReceiveProps(newProps) {
    let newActiveChatPartner = newProps.chatDrawers.activeChatPartner;
    let oldActiveChatPartner = this.props.chatDrawers.activeChatPartner;
    if (!newActiveChatPartner) { // disconnect socket when chat drawer is closed
      if (this.socket) this.socket.disconnect(true);
      return;
    } else if (newActiveChatPartner === oldActiveChatPartner) { // continue only when user selects a different chat partner
      return;
    }

    // 1. if activeChatPartner is not null, either fetch an existing chat room, 
    this.props.fetchChatRoom(newActiveChatPartner)
      .then((action) => {
        // or create a new chat room
        if (action.type === 'RECEIVE_CHAT_ERRORS') return this.props.createChatRoom(newActiveChatPartner);
        return action;
      })
      .then((action) => {
        // 2. send the chat Id to server when connecting thru websocket, that serves as the chat 'room' on the server
        const chatRoomId = action.payload._id; // payload will be the ChatRoom document
        this.createChatSocket(newActiveChatPartner, chatRoomId);
      });
    this.animateChatTransition();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    // disconnect any open sockets
    if (this.socket) this.socket.disconnect(true);
  }

  renderActiveChat() {
    const { activeChatPartner } = this.props.chatDrawers;
    if (!activeChatPartner) return null;

    return (
      <section className='active-chat chat-slide-up'
        ref={this.activeChatRef}
        onKeyDown={this.closeActiveChat}>
        <header className='active-chat-header'>
          <span>
            {activeChatPartner}
          </span>
          {/* <i className="fas fa-chevron-circle-down"></i> */}
          <i className="fas fa-times"
            onClick={this.closeActiveChat}></i>
        </header>
        {this.renderChatMessages()}
        {this.renderChatMessageForm()}
      </section>
    );
  }

  renderChatMessages() {
    // 3. fetch and render messages linked to chatId in desc order
    const { chatDrawers, chatMessages } = this.props;
    const chatRoom = this.props.chatRooms[chatDrawers.activeChatPartner];
    if (!chatRoom) return null; // when chatRoom hasn't been fetched
    let chatMessageElements = chatRoom.messages.map((messageId) => {
      let message = chatMessages[messageId];
      return this.renderChatMessage(message);
    });
    return (
      <div className='scrolling-container'
        ref={this.scrollingContainerRef}>
        <ul className='active-chat-messages'>
          {chatMessageElements}
        </ul>
      </div>
    );
  }

  renderChatMessage(message) {
    if (!message) return null;
    const { users } = this.props;
    let author = users[message.author];
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
      <form className='chat-message-form'
        onSubmit={this.handleSubmit}>
        <div className='chat-message-input'>
          <textarea type='text'
            name='message'
            placeholder='Say your thing'
            autoFocus={true}
            value={this.state.newChatMessage}
            onChange={this.handleChange}
            onKeyDown={(e) => { if (e.key === 'Enter') this.handleSubmit(e) } /* to prevent creating new line in textarea */} />
        </div>
        <div className='chat-message-submit'>
          <button type='submit'
            className="far fa-paper-plane"></button>
        </div>
      </form>
    )
  }

  renderMinimizedChats() {
    // TODO
    let minimizedChatAvatars = null;
    return (
      <ul className='minimized-chats'>
        {minimizedChatAvatars}
      </ul>
    );
  }

  renderMinimizedChatAvatar(chatPartner) {
    // TODO
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

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.newChatMessage.length) return; // do nothing if user tries to submit empty input
    const { chatRooms, createChatMessage } = this.props;
    const { activeChatPartner } = this.props.chatDrawers;
    let newChatMessage = {
      chatRoom: chatRooms[activeChatPartner]._id,
      author: this.context.currentUser._id,
      body: this.state.newChatMessage,
    };
    // 4. in handleSubmit, post new message, which is attached to the socket event
    // TODO: need to know if the chat partner is online, so can set the 'unread' to true or false
    createChatMessage(activeChatPartner, newChatMessage);
    this.socket.emit('chatMessage');
    this.setState({ newChatMessage: '' });
  }

  resizeChatMessageInput(e) {
    // textLength for a full row is 46px
    let rows = Math.ceil(e.currentTarget.textLength / 46);
    // height of a row is 16px
    let newHeight = rows * 16 || 16; // if there are zero rows, min height is 16px
    e.currentTarget.style.height = `${newHeight}px`;
  }

  closeActiveChat(e) {
    if (e.type === 'keydown' && e.key !== 'Escape') return; // do nothing if key pressed is not Esc
    this.activeChatRef.current.classList.add('chat-slide-down');
    // setTimeout to dispatch redux action to nullify activeChatPartner
    let animateCloseChatDrawerTimer = setTimeout(
      () => {
        clearTimeout(animateCloseChatDrawerTimer);
        animateCloseChatDrawerTimer = null;
        this.props.closeChatDrawer('test');
      },
      200
    );
  }

  animateChatTransition() {
    if (!this.activeChatRef.current) return;
    this.activeChatRef.current.classList.remove('chat-slide-up');
    let animateChatTransitionTimer = setTimeout(
      () => {
        clearTimeout(animateChatTransitionTimer);
        animateChatTransitionTimer = null;
        this.activeChatRef.current.classList.add('chat-slide-up');
      },
      100
    );
  }

  createChatSocket(activeChatPartner, chatRoomId) {
    const options = { query: { chatRoom: chatRoomId } }
    this.socket = io('/chat', options); // connect to the chat namespace and create a room based on ChatRoom._id on the server-side
    this.socket.on('connect', (err) => {
      // REMOVE IN PROD
      console.log(`${this.socket.id} joined room ${chatRoomId}`);
      // REMOVE IN PROD
      this.socket.on('chatMessage', () => {
        // 5. on the socket event occuring, fetch the latest message
        this.props.fetchChatMessage(activeChatPartner, chatRoomId);
      });
    });
    // REMOVE IN PROD
    this.socket.on('disconnect', (reason) => {
      console.log(reason);
    });
    // REMOVE IN PROD
  }

  scrollToBottom() {
    if (this.scrollingContainerRef.current) {
      this.scrollingContainerRef.current.scrollTop = this.scrollingContainerRef.current.scrollHeight;
    }
  }
}

ChatDrawer.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatDrawer);