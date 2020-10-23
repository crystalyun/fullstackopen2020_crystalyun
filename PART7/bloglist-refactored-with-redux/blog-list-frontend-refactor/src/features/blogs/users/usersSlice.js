import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBlogs, addNewBlog, addNewComment } from '../blogsSlice'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // And handle the same fetch result by inserting the users here
            usersAdapter.upsertMany(state, action.payload.entities.users)
        },
        [addNewBlog.fulfilled]: (state, action) => {
            const id = Object.keys(action.payload.users)[0]
            usersAdapter.upsertOne(state, action.payload.users[id])
        },
        [addNewComment.fulfilled]: (state, action) => {
            const id = Object.keys(action.payload.users)[0]
            usersAdapter.upsertOne(state, action.payload.users[id])
        }
    }
})

export const {} = usersSlice.actions

export default usersSlice.reducer

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = usersAdapter.getSelectors(state => state.blogs.users)
