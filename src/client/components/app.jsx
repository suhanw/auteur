import React from 'react';
import {Route, Switch} from 'react-router-dom';
import SessionFormContainer from './session/session_form_container';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Route path='/login' component={SessionFormContainer} />
        <Route path='/signup' component={SessionFormContainer} />
      </div>
    );
  }
}

export default App;
