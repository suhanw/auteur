import { connect } from 'react-redux';
import SessionForm from './session_form';
import { selectSessionErrors } from '../../selectors/selectors';
import { signup, login } from '../../actions/session_actions';
import { clearErrors } from '../../actions/clear_actions';

const mapStateToProps = function (state, ownProps) {
  const path = ownProps.path;
  const pathname = ownProps.pathname;
  console.log('sess form container pathname', path);

  const errors = selectSessionErrors(state);
  const sessionId = state.session.id;
  return {
    path,
    pathname,
    errors,
    sessionId,
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  const path = ownProps.path;
  let submit = login;
  if (path === '/signup') {
    submit = signup;
  }
  return {
    submit: (user) => dispatch(submit(user)),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);
