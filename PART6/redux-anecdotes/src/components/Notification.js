import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeNotification  } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (notification) {
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)

    return (
      <div style={style}>
        {notification}
      </div>
    )
  }

  if (!notification) {
    console.log('null notification message, render null')
    return null
  }
}

export default Notification
