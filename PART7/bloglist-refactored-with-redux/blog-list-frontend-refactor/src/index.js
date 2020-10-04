import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import theme from './theme'
import { ThemeProvider } from '@material-ui/core'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
