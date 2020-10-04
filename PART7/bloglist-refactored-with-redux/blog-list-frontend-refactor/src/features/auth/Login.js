import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requestLogin } from './authSlice'
import { Avatar, Button, CssBaseline, TextField, Typography, makeStyles, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.primary.main
  }
}))

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const classes = useStyles()

  const loginRequestStatus = useSelector(state => state.auth.status)

  const login = (event) => {
    event.preventDefault()
    dispatch(requestLogin({ username, password }))
    setUsername('')
    setPassword('')
  }

  if (loginRequestStatus === 'loading') {
    return <div className="loader">Loading...</div>
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

export default Login