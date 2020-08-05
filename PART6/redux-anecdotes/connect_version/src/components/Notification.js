import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (!props.notification) {
    console.log('null notification message, render null')
    return null
  }

  return (
    <div style={style}>
        {props.notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification.message
  }
}

const ConnectedNotification = connect(
  mapStateToProps
)(Notification)

export default ConnectedNotification
