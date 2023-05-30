import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import App from './App';
import { CookiesProvider } from "react-cookie";
import { AppProvider } from "./context/appContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
  <AppProvider>
    <App />
  </AppProvider>
  </CookiesProvider>
);
