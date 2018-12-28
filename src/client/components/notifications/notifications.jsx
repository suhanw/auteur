import React from 'react';

export const LikeNotification = (props) => {
  const { author, post } = props.notifiable;
  const notifMessageLength = author.username.length + 'liked your'.length + post.type.length + post.title.length;
  return (
    <li className='notif-like'>
      <div className='notif-avatar'>
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${author.avatarImageUrl})` }} />
        <div className='notif-like-icon'>
          <i className="fas fa-heart"></i>
        </div>
      </div>
      <div className='notif-message'>
        {(notifMessageLength > 35) ? <div className='notif-message-overlay' /> : null}
        <h1 className='notif-author'>{author.username}</h1>&nbsp;
        <span>liked your</span>&nbsp;
        {entityMessage(post)}
      </div>
      {entityIcon(post)}
    </li>
  );
};

export const CommentNotification = (props) => {
  const { author, post } = props.notifiable;
  const notifMessageLength = author.username.length + 'commented on your'.length + post.type.length + post.title.length;
  return (
    <li className='notif-comment'>
      <div className='notif-avatar'>
        <div className='avatar avatar-extra-small'
          style={{ backgroundImage: `url(${author.avatarImageUrl})` }} />
        <div className='notif-comment-icon'>
          <i className="fas fa-comment"></i>
        </div>
      </div>
      <div className='notif-message-container'>
        <div className='notif-message'>
          {(notifMessageLength > 35) ? <div className='notif-message-overlay' /> : null}
          <h1 className='notif-author'>{author.username}</h1>&nbsp;
          <span>commented on your</span>&nbsp;
          {entityMessage(post)}
        </div>
        <div className='comment-body'>{props.notifiable.body}</div>
      </div>
      {entityIcon(post)}
    </li>
  )
};


const entityMessage = (entity) => {
  switch (entity.type) {
    case 'text':
      return (
        <div>
          <span>post </span>
          <span className='notif-entity-message'>{`"${entity.title}"`}</span>
        </div>
      );
    case 'photo':
      return (
        <div>photo </div>
      );
    default:
      return (
        <div>
          <span>{entity.type} </span>
          <span className='notif-entity-message'>{`"${entity.title}"`}</span>
        </div>
      );
  }
};

const entityIcon = (entity) => {
  const entityIcons = {
    'text': <i className="fas fa-font"></i>,
    'photo': <i className="fas fa-camera-retro"></i>,
    'quote': <i className="fas fa-quote-left"></i>,
    'link': <i className="fas fa-link"></i>,
  };
  return (
    <div className='notif-entity-icon'>
      {entityIcons[entity.type]}
    </div>
  );
};