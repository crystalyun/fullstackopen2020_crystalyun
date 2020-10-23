import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { normalize, schema } from 'normalizr'
import blogs from '../../services/blogs'
import comments from '../../services/comments'

// Define normalizr entity schemas
export const userEntity = new schema.Entity('users')
export const commentEntity = new schema.Entity('comments', {
    user: userEntity
})
export const postEntity = new schema.Entity('posts', {
    user: userEntity,
    comments: [commentEntity]
})

const initialState = {
    fetchAll : {
        status: 'idle',
        error: null,
        hasNext: true,
        next: null,
        sortOption: 'createdAt'
    },
    addOne: {
        status: 'idle',
        error: null
    },
}

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (_, { getState }) => {
        const { token } = getState().auth.currentUser
        const { sortOption, next, hasNext } = getState().blogs.status.fetchAll
        const nextUrl = next || `http://localhost:3003/api/blogs?sort=${sortOption}`
        // next is null when it is the firstpage or when it is indeed a last page.
        // if firstpage, next is null and hasNext is true. in this case, use hardcoded url to make a request.
        // if last page already, next is null and hasNext is false. in this case, do not call api.
        if (hasNext) {
            const response = await blogs.getBlogs({ token, nextUrl })
            // Normalize the data so reducers can load a predictable payload, like:
            // `action.payload.entities = { users: {}, posts: {}, comments: {} }`
            const normalized = normalize(response.blogs, [postEntity])
            return {
                hasNext: response.hasNext,
                next: response.next,
                entities: normalized.entities,
            }
        } else {
            console.log('hit end. No data to fetch.')
            return
        }
    }
)

export const likeBlog = createAsyncThunk(
    'blogs/likeBlog',
    async (postId, { getState }) => {
        const { token } = getState().auth.currentUser
        const response = await blogs.likeBlog({ token, postId })
        return response
    }
)

export const unlikeBlog = createAsyncThunk(
    'blogs/unlikeBlog',
    async (postId, { getState }) => {
        const { token } = getState().auth.currentUser
        const response = await blogs.unlikeBlog({ token, postId })
        return response
    }
)

export const toggleLikeBlog = createAsyncThunk(
    'blogs/toggleLikeBlog',
    async (post, { dispatch }) => {
        if (post.didUserLike) {
            console.log('request unlikePost')
            dispatch(unlikeBlog(post.id))
        } else {
            console.log('request likePost')
            dispatch(likeBlog(post.id))
        }
    }
)

export const addNewComment = createAsyncThunk(
    'blogs/addNewComment',
    async ({ postId, comment }, { getState }) => {
        const { token } = getState().auth.currentUser
        const response = await comments.create({ token, postId, comment })
        const normalized = normalize(response, commentEntity)
        return normalized.entities
    }
)

export const addNewBlog = createAsyncThunk(
    'blogs/addNewBlog',
    // The payload creator receives the partial `{title, author, url}` object
    async (initialBlog, { getState }) => {
        const { token } = getState().auth.currentUser
        // We send the initial data to the backend API server
        const response = await blogs.create({
            blog: initialBlog,
            token
        })
        // The response includes the complete blog object, including unique ID
        // update the response to match Redux post state signature
        const newState = Object.assign({}, response)
        delete newState['likes']
        const normalized = normalize({ ...newState, didUserLike: false }, postEntity)
        return normalized.entities
    }
)

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setSortOption: (state, action) => {
            state.sortOption = action.payload
        },
    },
    extraReducers: {
        [fetchBlogs.pending]: (state, action) => {
            state.fetchAll.status = 'loading'
        },
        [fetchBlogs.fulfilled]: (state, action) => {
            state.fetchAll.status = 'succeeded'
            // set hasNext and next to the response.hasNext and response.next 
            // if it is last page, then hasNext will set to false and next will set to null automatically.
            // otherwise, hasNext will set to true and next to string
            state.fetchAll.hasNext = action.payload.hasNext
            state.fetchAll.next = action.payload.next
        },
        [fetchBlogs.rejected]: (state, action) => {
            state.fetchAll.status = 'failed'
            state.fetchAll.error = action.error.message
        },
        [addNewBlog.pending]: (state, action) => {
            state.addOne.status = 'pending'
        },
        [addNewBlog.fulfilled]: (state, action) => {
            state.addOne.status = 'succeeded'
        },
        [addNewBlog.rejected]: (state, action) => {
            state.addOne.status = 'failed'
            state.addOne.error = action.error.message
        },
    }
})

export const { setSortOption } = blogsSlice.actions

export default blogsSlice.reducer