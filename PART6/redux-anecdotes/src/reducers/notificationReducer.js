const notificationReducer = (state = null, action) => {
    console.log('action hit notification reducer')
    console.log('print out action in notification reducer ', action)
    switch (action.type) {
        case 'DISPLAY_NOTIFICATION':
            return action.message
        default:
            return state
    }
}

export const notificationChange = (message) => {
    return {
        type: 'DISPLAY_NOTIFICATION',
        message
    }
}

export default notificationReducer