import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/authContext';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { Provider } from 'react-redux';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter> 
              <AuthProvider>
                  <App />
              </AuthProvider>
          </BrowserRouter>
      </Provider>
  </React.StrictMode>
);

