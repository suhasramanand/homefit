import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import { registerServiceWorker } from "./RegisterWorker";


// Only set default axios config if not using mock API
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || 
                 (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL);

if (!USE_MOCK) {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Service worker registration disabled - uncomment if needed
// registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
