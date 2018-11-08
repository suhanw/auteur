export const selectCurrentUser = function(state) {
  const currentUserId = state.session.id;
  if (!currentUserId) {
    return null;
  }
  const currentUser = state.entities.users.byId[currentUserId];
  return currentUser;
};

export const selectSessionErrors = function(state) {
  const {errors: {sessionErrors}} = state;
  return sessionErrors;
}
