// after using redux-thunk

/*
**notificationReducer.js**
const notificationReducer = (state = null, action) => {
  console.log('action hit notification reducer')
  console.log('print out action in notification reducer ', action)
  switch (action.type) {
  case 'DISPLAY_NOTIFICATION':
    return action.message
  case 'REMOVE_NOTIFICATION':
    return null
  default:
    return state
  }
}







*/