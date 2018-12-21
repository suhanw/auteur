import { connect } from 'react-redux';
import React from 'react';
import { selectCurrentUser } from '../selectors/selectors';
// import { fetchUserFollowing } from '../actions/user_actions';

const mapStateToProps = (state, _) => {
  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
  };
};

// const mapDispatchToProps = (dispatch, _) => {
//   return {
//     fetchUserFollowing: (userId) => dispatch(fetchUserFollowing(userId)),
//   };
// };

export const GlobalContext = React.createContext(null);

class GlobalContextProvider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, currentUser, fetchUserFollowing } = this.props;
    return (
      <GlobalContext.Provider
        value={{
          currentUser,
          // fetchUserFollowing
        }} >
        {children}
      </GlobalContext.Provider>
    );
  }
}

export default connect(mapStateToProps, null)(GlobalContextProvider);