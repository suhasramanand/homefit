import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import { registerServiceWorker } from "./RegisterWorker";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4000';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Register service worker
registerServiceWorker();

reportWebVitals();
