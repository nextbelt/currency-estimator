import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CurrencyValueEstimator from './CoinValueEstimator';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CurrencyValueEstimator />
  </React.StrictMode>
);