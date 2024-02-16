import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

import theme from './theme';
import appRouter from './routes';
import store from './store';

/**
 * @ - import src
 * @assets - import assets
 * @pages - import pages
 * @common - import from src/components/common
 * @script - import from src/components/script
 */
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'production') {
  console.log('you are on production');
  console.log = function () {};
  console.debug = function () {};
  console.warn = function () {};
  console.error = function () {};
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* provide theming */}
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* router-dom configuration */}
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
