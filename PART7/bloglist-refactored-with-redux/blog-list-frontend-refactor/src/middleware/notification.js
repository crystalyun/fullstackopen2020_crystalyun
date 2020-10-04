import { showNotificationWithTimeout, removeNotification } from '../features/notification/notificationSlice'
import storage from '../utils/storage'

export const localStorage = store => next => action => {
    if (action.type === 'auth/requestLogin/fulfilled') {
        storage.saveUser(action.payload)
    } else if (action.type === 'auth/logout') {
        storage.removeUser()
    }
    
    next(action)
}


export const loginNotification = ({ dispatch, getState }) => next => action => {
    next(action)

    if (action.type === 'auth/requestLogin/fulfilled') {
        dispatch(showNotificationWithTimeout({
            message: `${action.payload.name} welcome back!`,
            error: false
        }))
    } else if (action.type === 'auth/requestLogin/rejected') {
        dispatch(showNotificationWithTimeout({
            message: `${action.payload.error}`,
            error: true
        }))
    } else if (action.type === 'auth/requestLogin/pending') {
        // remove any existing notification on display
        if (getState().notification.error || getState().notification.message) {
            dispatch(removeNotification())
        }
    }
}

export const notificationMdl = [localStorage,loginNotification]