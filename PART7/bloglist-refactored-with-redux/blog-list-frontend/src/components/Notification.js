import React from 'react'
import { makeStyles } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '8px',
  },
}))

const Notification = ({notification}) => {
  const classes = useStyles()

  if (!notification) {
    return null
  }

  return (
    <div className={classes.root}>
      <Alert severity={notification.error ? 'error' : 'success'} variant="filled">
        {notification.message}
      </Alert>
  </div>
    
  )
}

export default Notification
