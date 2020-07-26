import React from 'react';
import ReactDOM from 'react-dom';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { persistor, store } from './app/store';
import './index.css';
import './map-buttons.css';
import './scrollbar.css';
import * as serviceWorker from './serviceWorker';
import './whyDidYouRender';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
