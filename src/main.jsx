import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { store } from './store';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: { main: '#4f8ef7' },
    background: { default: '#f0f2f5' },
  },
  shape: { borderRadius: 10 },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
