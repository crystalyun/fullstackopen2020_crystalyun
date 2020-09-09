import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'
import theme from './theme'
import { ThemeProvider } from '@material-ui/core'

ReactDOM.render(
  <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Router>
  </Provider>,
  document.getElementById('root')
)