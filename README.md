Sample State

```javascript
{
  entities: {
    posts: {
      byId: {
        1: {
          id: 1,
          type: 'text',
          author: 123,
          body: '....',
          likeCount: 234,
          commentCount: 10,
          tags: [5, 6, 7],
          createdAt: ...,
          updatedAt: ...,
          blog: 1
        },
        ...
      },
      allIds: [1, 2, 3, ...]
    },
    notes: {
      byId: {
        1: {
          id: 1,
          type: 'like',
          author: 456,
          body: null,
          createdAt: ...
          post  : 234,
        },
        2: {
          id: 2,
          type: 'comment',
          author: 50,
          body: 'this is a comment',
          createdAt: ...
          postId: 430,
        }
      },
      allIds: [1, 2, 3, ...]
    },
    blogs: {
      byId: {
        1: {
          id: 1,
          author: 2,
          primary: true/false,
          title: 'movie gifs', // same as username if primary blog
          description: '...',
          avatarImageUrl: '...', // same as user image if primary blog
          backgroundImageUrl: '...',
          members: [1, 2, 3],
          followerCount: 123,
        }
      },
      allIds: [1, 2, 3, 4]
    },
    users: {
      byId: {
        34: {
          id: 34,
          avatarImageUrl: '...',
          username: 'nwijaya',
        },
        59: {
          id: 59,
          avatarImageUrl: '...',
          username: 'vzhang',
        }
      },
      allIds: [34, 59, ...]
    },
    chats: {
      byId: {
        1: {
          id: 1,
          participants: [1, 23], //user id
        },
        2: {
          id: 2,
          participants: [1, 50],
        }
      },
      allIds: [1, 2, ...]
    },
    chatMessages: {
      byId: {
        500: {
          id: 500,
          author: 23,
          body: '...',
          createdAt: '..',
          chatId: 1
        },
        600: {
          id: 600,
          author: 23,
          body: '...',
          createdAt: '...'
          chatId: 1
        }
      },
      allIds: [500, 600]
    }
  },

  ui: {
    loading: {
      loadingPostIndex: true/false,
      loadingSearchIndex: true/false,
      ...
    },
    modal: {
      modalPostCreate: true/false,
      modalPostDelete: true/false,
      modalLogout: true/false,
      ...
    },
    popover: {
      avatarPopover: true/false,
      notePopover: true/false,
      chatPopover: { active: 1 },
      ...
    },
    dropdown: {
      notificationDropdown: true/false,
      accountDropdown: true/false,
      searchDropdown: true/false
    },
    sideBar: {
      blogShowSidebar: true/false
    },
    searchText: '...'
  },

  errors: {
    signupErrors: [],
    loginErrors: [],
  },

  session: {
    currentUser: {
      id: 1,
      email: 'dw@gmail.com',
      username: 'dwash',
      avatarImageUrl: '...'
      blogs: [1, 2, 3]
      following: [1, 2, 3, ...] // blogIds
    }
  }
}
```
