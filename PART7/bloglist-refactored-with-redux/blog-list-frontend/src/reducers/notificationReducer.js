const notificationReducer = (state = null, action) => {
    switch (action.type) {
        case 'DISPLAY_NOTIFICATION':
            return { message: action.message, error: action.error}
        case 'REMOVE_NOTIFICATION':
            return null
        default:
            return state
    }

}

export const displayNotification = (message, error) => {
    return {
        type: 'DISPLAY_NOTIFICATION',
        message,
        error
    }
}

export const removeNotification = () => {
    return {
        type: 'REMOVE_NOTIFICATION'
    }
}

// make use of redux-thunk to implement front-end notification logic that DISPLAY notification and after X seconds REMOVE notification.
let timer
export const showNotificationWithTimeout = ({message, error, seconds = 10}) => {
    return (dispatch) => {
        clearTimeout(timer)

        dispatch(displayNotification(message, error))

        timer = setTimeout(() => {
            dispatch(removeNotification())
        }, seconds*1000)
    }
}

export default notificationReducer