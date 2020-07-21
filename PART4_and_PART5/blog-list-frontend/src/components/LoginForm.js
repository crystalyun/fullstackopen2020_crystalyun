import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = (props) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={props.handleLogin}>
        <div>
            username
          <input
            id="username"
            type="text"
            value={props.username}
            onChange={({ target }) => props.setUsername(target.value)}
          />
        </div>
        <div>
            password
          <input
            id="password"
            type="password"
            value={props.password}
            onChange={({ target }) => props.setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm