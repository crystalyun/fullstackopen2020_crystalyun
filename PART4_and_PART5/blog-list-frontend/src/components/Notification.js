import React from 'react'

const Notification = (props) => {
    if (props.notification.message === null) {
      return null
    }
  
    return (
      <div className={props.notification.error ? "notification error" : "notification success"}>
        {props.notification.message}
      </div>
    )
}

export default Notification
