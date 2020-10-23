import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { fetchBlogs, addNewComment } from '../blogsSlice'

const commentsAdapter = createEntityAdapter()

const commentsSlice = createSlice({
    name: 'comments',
    initialState: commentsAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // Same for the comments
            if (action.payload.entities.comments) {
                commentsAdapter.upsertMany(state, action.payload.entities.comments)
            }
        },
        [addNewComment.fulfilled]: (state, action) => {
            const id = Object.keys(action.payload.comments)[0]
            const comment = action.payload.comments[id]
            const { message, user, createdAt, updatedAt } = comment
            commentsAdapter.addOne(state, Object.assign({}, {
                message,
                user,
                createdAt,
                updatedAt,
                id
            }))
        }
    }
})

export const {} = commentsSlice.actions

export default commentsSlice.reducer

export const {
    selectAll: selectAllComments,
    selectById: selectCommentById
} = commentsAdapter.getSelectors(state => state.blogs.comments)
