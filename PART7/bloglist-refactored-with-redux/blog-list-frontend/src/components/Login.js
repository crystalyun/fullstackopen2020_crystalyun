import React, { useState } from 'react'
import { makeStyles, AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import Notification from './Notification'
import LoginForm from './LoginForm'
import { logInUser } from '../reducers/signInUserReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
  },
}))

const Login = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [redirectToReferrer, setRedirectToReferrer] = useState(false)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)
  let location = useLocation()

  console.log('location.state?' , location.state)

  // second condition is for cases where users access the app directly from localhost:3000/login and thus location.state is undefined. [location.state was manually set in PrivateRoute component's <Redirect to> and to be carried over to Login component.]
  const { from } = location.state || { from: { pathname: '/' } }

  const handleLogin = async ({ username, password }) => {
    const loginSuccess = await dispatch(logInUser(username, password))
    if (loginSuccess) {
      setRedirectToReferrer(true)
    }
  }

  if (redirectToReferrer) {
    return <Redirect to={from} />
  }

  return (
    <>
      <AppBar className={classes.appBar}>
        <Container>
          <Toolbar>
            <Typography variant="h6" style={{ margin: '0px 25px 0px 0px' }}>
              Blog
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />

      <Notification notification={notification} />

      <LoginForm handleLogin={handleLogin} />
      
    </>
  )
}

export default Login