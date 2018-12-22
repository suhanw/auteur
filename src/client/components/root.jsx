import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './app';
import GlobalContextProvider from './global_ context_provider';

const Root = function (props) {
  const { store } = props;
  return (
    <Provider store={store}>
      <GlobalContextProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </GlobalContextProvider>
    </Provider>
  );
};

export default Root;