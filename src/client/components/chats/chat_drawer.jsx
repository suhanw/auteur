import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { GlobalContext } from '../global_ context_provider';
import { selectChatDrawers, selectChatRooms, selectUsers } from '../../selectors/selectors';
import { closeChatDrawer, createChatRoom } from '../../actions/chat_actions';

const mapStateToProps = (state, _) => {
  const chatDrawers = selectChatDrawers(state);
  const chatRooms = selectChatRooms(state);
  const users = selectUsers(state);
  return {
    chatDrawers,
    chatRooms,
    users,
  };
};

const mapDispatchToProps = (dispatch, _) => {
  return {
    closeChatDrawer: (chatDrawer) => dispatch(closeChatDrawer(chatDrawer)),
    createChatRoom: (chatPartner) => dispatch(createChatRoom(chatPartner)),
  };
};

class ChatDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newChatMessage: '',
      messages: [{ _id: 'test', body: 'test' }],
    };

    this.socket = null;

    this.activeChatRef = React.createRef();

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
    // 1. if activeChatPartner is not null, either fetch an existing chat, or create a new chat
    // 2. send the chat Id to server when connecting thru websocket, that serves as the chat 'room' on the server
    // 3. fetch and render messages linked to chatId in desc order
    // 4. in handleSubmit, post new message, which is attached to the socket event
    // 5. on the socket event occuring, fetch and render the latest message

    this.socket = io('/chat', {
      query: {
        room: 'test room'
      }
    }); // connect to the chat namespace
    this.socket.on('connect', () => {
      console.log(this.socket.id);
    });
    this.socket.on('chatMessage', (data) => {
      let newMessages = this.state.messages.slice();
      newMessages.push(data);
      this.setState({ messages: newMessages }, () => console.log(this.state));
    });
  }

  componentWillReceiveProps(newProps) {
    let newActiveChatPartner = newProps.chatDrawers.activeChatPartner;
    let oldActiveChatPartner = this.props.chatDrawers.activeChatPartner;
    if (newActiveChatPartner !== oldActiveChatPartner) {
      // 1. if activeChatPartner is not null, either fetch an existing chat, 
      // or create a new chat
      this.props.createChatRoom(newActiveChatPartner);
    }
  }

  componentWillUnmount() {
    this.socket.disconnect(true);
  }

  renderActiveChat() {
    const { activeChatPartner } = this.props.chatDrawers;
    if (!activeChatPartner) return null;
    return (
      <section className='active-chat chat-slide-up'
        ref={this.activeChatRef}>
        <header className='active-chat-header'>
          <span>
            {activeChatPartner}
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
    // let author = this.context.currentUser;
    // let message = { _id: 'test', body: 'test' };
    // let chatMessages = this.state.messages.map((message) => {
    //   return this.renderChatMessage(author, message);
    // })
    // TESTING
    const { activeChatPartner } = this.props.chatDrawers;
    const chatRoom = this.props.chatRooms[activeChatPartner];
    if (!chatRoom) return null; // when chatRoom hasn't been fetched
    let chatMessages = chatRoom.messages.map((message) => {
      return this.renderChatMessage(message);
    })
    return (
      <div className='scrolling-container'>
        <ul className='active-chat-messages'>
          {chatMessages}
        </ul>
      </div>
    );
  }

  renderChatMessage(message) {
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

  handleSubmit(e) {
    e.preventDefault();
    let newMessage = {
      _id: 'test2',
      body: this.state.newChatMessage,
    };
    this.socket.emit('chatMessage', newMessage);
    this.setState({ newChatMessage: '' });
  }

  renderMinimizedChats() {
    let minimizedChatAvatars = null;
    // TESTING
    // let chatPartner = {
    //   avatarImageUrl: 'https://res.cloudinary.com/allamerican/image/fetch/t_face_s270/https://speakerdata2.s3.amazonaws.com/photo/image/884111/2f72417d5d6a580ab37a4d925c9e3a8d.jpg'
    // }
    // minimizedChatAvatars = [
    //   this.renderMinimizedChatAvatar(chatPartner),
    //   this.renderMinimizedChatAvatar(chatPartner),
    // ];
    // TESTING
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
}

ChatDrawer.contextType = GlobalContext;

export default connect(mapStateToProps, mapDispatchToProps)(ChatDrawer);