import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBlogs } from '../blogsSlice'

const commentsAdapter = createEntityAdapter()

const commentsSlice = createSlice({
    name: 'comments',
    initialState: commentsAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // Same for the comments
            commentsAdapter.upsertMany(state, action.payload.comments)
        }
    }
})

export const {} = commentsSlice.actions

export default commentsSlice.reducer