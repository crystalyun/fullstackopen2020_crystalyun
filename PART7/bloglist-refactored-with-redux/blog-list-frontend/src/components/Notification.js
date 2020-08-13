import React from 'react'

const Notification = ({notification}) => {

  if (!notification) {
    return null
  }

  return (
    <div className={notification.error ? 'notification error' : 'notification success'}>
      {notification.message}
    </div>
  )
}

export default Notification
