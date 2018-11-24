export const RECEIVE_USERS = 'RECEIVE_USERS';

export const receiveUsers = function (users) {
  return {
    type: RECEIVE_USERS,
    payload: users,
  };
};