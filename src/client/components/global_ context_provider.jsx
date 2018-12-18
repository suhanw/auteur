import { connect } from 'react-redux';
import React from 'react';
import { selectCurrentUser } from '../selectors/selectors';

const mapStateToProps = (state, _) => {
  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
  };
};

export const GlobalContext = React.createContext(null);

class GlobalContextProvider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('rendering GLobalContextProvider');
    const { children, currentUser } = this.props;
    return (
      <GlobalContext.Provider value={{ currentUser: currentUser }} >
        {children}
      </GlobalContext.Provider>
    );
  }
}

export default connect(mapStateToProps, null)(GlobalContextProvider);