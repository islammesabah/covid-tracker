import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './App';

// Build a green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2B872B',
    }
  },
});

// Main render
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
