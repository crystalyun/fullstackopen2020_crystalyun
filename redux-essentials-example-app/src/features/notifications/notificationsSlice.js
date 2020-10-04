import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// Sort with newest first. Most recent noficiation id is first in the `ids` array.
const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
      const allNotifications = selectAllNotifications(getState()) // array of objects
      const [latestNotification] = allNotifications //first object in the allNotifications array
      const latestTimestamp = latestNotification ? latestNotification.date : ''
      const response = await client.get(
          `/fakeApi/notifications?since=${latestTimestamp}`
      )
      return response.notifications // array of notifications
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state, action) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled]: (state, action) => {
            Object.values(state.entities).forEach(notification => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
            notificationsAdapter.upsertMany(state, action.payload)
        }
    }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
    selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)
