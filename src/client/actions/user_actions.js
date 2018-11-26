export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';

export const receiveUsers = function (users) {
  return {
    type: RECEIVE_USERS,
    payload: users,
  };
};

export const receiveUser = function (user) {
  return {
    type: RECEIVE_USER,
    payload: user,
  };
};
