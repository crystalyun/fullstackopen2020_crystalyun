import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { normalize, schema } from 'normalizr'
import blogs from '../../services/blogs'

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
        error: null
    },
    addOne: {
        status: 'idle',
        error: null
    }
}

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (_, { getState }) => {
        const { token } = getState().auth.currentUser
        const response = await blogs.getAll({ token })
        // Normalize the data so reducers can load a predictable payload, like:
        // `action.payload = { users: {}, posts: {}, comments: {} }`
        const normalized = normalize(response, [postEntity])
        console.log('wtf' , normalized)
        console.log('foo', normalized.entities)
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
        // The response includes the complete post object, including unique ID
        console.log('server finished creating new post : ', response)
        // update the response to match Redux post state signature
        const newState = Object.assign({}, response)
        delete newState['likes']
        const normalized = normalize({ ...newState, didUserLike: false }, postEntity)
        console.log('noo', normalized)
        console.log('boo', normalized.entities)
        return normalized.entities
    }
)

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchBlogs.pending]: (state, action) => {
            state.fetchAll.status = 'loading'
        },
        [fetchBlogs.fulfilled]: (state, action) => {
            state.fetchAll.status = 'succeeded'
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
        }
    }
})

const reducer = blogsSlice.reducer

export const {} = blogsSlice.actions

export default reducer