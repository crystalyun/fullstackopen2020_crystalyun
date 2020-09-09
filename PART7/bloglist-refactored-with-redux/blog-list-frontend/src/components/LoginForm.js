import React, { useState } from 'react'
import { Avatar, Button, CssBaseline, TextField, Typography, makeStyles, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.primary.main
  }
}))


const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const classes = useStyles()

  const login = (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Container component="main" maxWidth="xs" >
      <CssBaseline />
      <div style={{ paddingTop: '20vh' }}>
        <Avatar className={classes.avatar} style={{ margin: 'auto' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ textAlign: 'center', marginTop: '10px' }}>
          Welcome back
        </Typography>
        <form noValidate onSubmit={login}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button
            type="submit"
            color="primary"
            fullWidth
            variant="contained"
          >
            Log In
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default LoginForm