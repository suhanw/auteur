export const selectCurrentUser = function(state) {
  const { session: { currentUser } } = state;
  return currentUser;
}
