import './index.css';
//import './rsuite.css';
import './scrollbar.css';
import './whyDidYouRender';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
//import 'rsuite/dist/styles/rsuite-dark.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
