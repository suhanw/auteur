import {connect} from 'react-redux';
import Navbar from './navbar';
import {logout} from '../../actions/session_actions';
import {selectCurrentUser} from '../../selectors/selectors';


const mapStateToProps = function(state, ownProps) {
  const currentUser = selectCurrentUser(state);
  return {
    currentUser,
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
