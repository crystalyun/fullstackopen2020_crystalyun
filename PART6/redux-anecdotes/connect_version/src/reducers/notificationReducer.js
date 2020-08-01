const notificationReducer = (state = {}, action) => {
  switch (action.type) {
  case 'DISPLAY_NOTIFICATION': {
    const id = action.id
    const message = action.message
    return { id, message }
  }
  case 'REMOVE_NOTIFICATION':
    return {}
  default:
    return state
  }
}

export const displayNotification = (id, message) => {
  return {
    type: 'DISPLAY_NOTIFICATION',
    id,
    message
  }
}

export const removeNotification = (id) =>  {
  return {
    type: 'REMOVE_NOTIFICATION',
    id
  }
}

// thunk action creator. Instead of returning action creator object it returns a action creator function that Redux recognizes
let nextNotificationId = 0
let timer
export const showNotificationWithTimeout = (message, seconds) => {
  return function (dispatch, getState) {
    clearTimeout(timer)

    const id = nextNotificationId++
    dispatch(displayNotification(id, message))
    
    timer = setTimeout(() => {
      dispatch(removeNotification(id))
    }, seconds*1000)
  }
}

export default notificationReducer