import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: null,
    error: null
}

let timer
export const showNotificationWithTimeout = notification => dispatch => {
    const { message, error, seconds = 10 } = notification
    clearTimeout(timer)

    dispatch(displayNotification({ message, error }))

    timer = setTimeout(() => {
        dispatch(removeNotification())
    }, seconds*1000)
}


export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        displayNotification: (state, action) => {
            state.message = action.payload.message
            state.error = action.payload.error
        },
        removeNotification: state => initialState
    },
})

export const { displayNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer