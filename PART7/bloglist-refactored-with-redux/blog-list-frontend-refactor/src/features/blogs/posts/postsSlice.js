import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBlogs, addNewBlog, likeBlog, unlikeBlog, addNewComment, setSortOption } from '../blogsSlice'
import _ from 'lodash'
import { parseISO } from 'date-fns'

const sortDescbyKey = (arr, key) => {
    const sorted = [...arr].sort(function(a,b) {
        return b[key] - a[key]
    })
    return sorted
}

const sortNewest = (arr, key) => {
    const sorted = [...arr].sort(function(a,b) {
        return parseISO(b[key]) - parseISO(a[key])
    })
    return sorted
}

const postsAdapter = createEntityAdapter()

export const sortPosts = (sortOption) => {
    return (dispatch, getState) => {
        dispatch(setSortOption(sortOption))

        const option = getState().blogs.status.sortOption
        const posts = _.values(getState().blogs.posts.entities)

        let sorted
        if (option === 'createdAt') {
            sorted = sortNewest(posts, option).map(obj => obj.id)
            dispatch(sortByNewest(sorted))
        } else {
            sorted = sortDescbyKey(posts, option).map(obj => obj.id)
            dispatch(sortByMost(sorted))
        }
    }
}


const postsSlice = createSlice({
    name: 'posts',
    initialState: postsAdapter.getInitialState(),
    reducers: {
        sortByMost: (state, action) => {
            state.ids = action.payload
        },
        sortByNewest: (state, action) => {
            state.ids = action.payload
        }
    },
    extraReducers: {
        [fetchBlogs.fulfilled]: (state, action) => {
            // Handle the fetch result by inserting the posts here
            postsAdapter.upsertMany(state, action.payload.entities.posts)
        },
        [addNewBlog.fulfilled]: (state, action) => {
            const id = Object.keys(action.payload.posts)[0]
            postsAdapter.addOne(state, action.payload.posts[id])
        },
        [likeBlog.fulfilled]: (state, action) => {
            const { id, likesCount, didUserLike } = action.payload
            const existingPost = state.entities[id]
            if (existingPost) {
                existingPost.didUserLike = didUserLike
                existingPost.likesCount = likesCount
            }
        },
        [unlikeBlog.fulfilled]: (state, action) => {
            const { id, likesCount, didUserLike } = action.payload
            const existingPost = state.entities[id]
            if (existingPost) {
                existingPost.didUserLike = didUserLike
                existingPost.likesCount = likesCount
            }
        },
        [addNewComment.fulfilled]: (state, action) => {
            const id = Object.keys(action.payload.comments)[0]
            const comment = action.payload.comments[id]
            const { blog } = comment
            const existingPost = state.entities[blog]
            if (existingPost) {
                existingPost.comments.push(id)
            }
        }

    }
})

export const { sortByMost, sortByNewest } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.blogs.posts)