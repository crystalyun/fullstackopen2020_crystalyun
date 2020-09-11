import React from 'react'
import { makeStyles, AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import Notification from './Notification'
import LoginForm from './LoginForm'
import { logInUser } from '../reducers/signInUserReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
  },
}))

const Login = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const notification = useSelector(state => state.notification)
  let history = useHistory()

  const handleLogin = ({ username, password }) => {
    dispatch(logInUser(username, password))
    history.push('/')
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