import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBlogs, addNewBlog } from '../blogsSlice'

const postsAdapter = createEntityAdapter()

const postsSlice = createSlice({
    name: 'posts',
    initialState: postsAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // Handle the fetch result by inserting the posts here
            console.log('omfg', action.payload.posts)
            postsAdapter.upsertMany(state, action.payload.posts)
        },
        [addNewBlog.fulfilled]: (state, action) => {
            console.log('so what fucker ', action.payload.posts)
            const id = Object.keys(action.payload.posts)[0]
            console.log('shiiiiit', Object.keys(action.payload.posts)[0])
            // postsAdapter.upsertOne(state, action.payload.posts)
            postsAdapter.addOne(state, action.payload.posts[id])
        }
    }
})

export const {} = postsSlice.actions

export default postsSlice.reducer