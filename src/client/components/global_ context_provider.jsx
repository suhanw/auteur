import { connect } from 'react-redux';
import React from 'react';
import { selectCurrentUser } from '../selectors/selectors';

const mapStateToProps = (state, _) => {
  return {
    currentUser: selectCurrentUser(state),
  };
};

export const GlobalContext = React.createContext(null);

class GlobalContextProvider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, currentUser } = this.props;
    return (
      <GlobalContext.Provider
        value={{
          currentUser,
        }} >
        {children}
      </GlobalContext.Provider>
    );
  }
}

export default connect(mapStateToProps, null)(GlobalContextProvider);