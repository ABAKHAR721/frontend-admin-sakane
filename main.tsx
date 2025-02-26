import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProps } from 'next/app';
import './index.css';
import './i18n';  // Import i18n configuration before rendering

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App Component={Component} pageProps={pageProps} router={router} />
  </StrictMode>
);