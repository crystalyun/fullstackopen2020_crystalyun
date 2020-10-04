import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBlogs, addNewBlog } from '../blogsSlice'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // And handle the same fetch result by inserting the users here
            console.log('fuck you seriously', action.payload.users)
            usersAdapter.upsertMany(state, action.payload.users)
        },
        [addNewBlog.fulfilled]: (state, action) => {
            console.log('so what shitters ', action.payload.users)
            const id = Object.keys(action.payload.users)[0]
            usersAdapter.upsertOne(state, action.payload.users[id])
            // usersAdapter.upsertOne(state, action.payload.users)
            // usersAdapter.addOne
        }
    }
})

export const {} = usersSlice.actions

export default usersSlice.reducer
