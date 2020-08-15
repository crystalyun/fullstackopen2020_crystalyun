import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_BLOG':
            return state.concat(action.data)
        case 'DELETE_BLOG':
            return state.filter(blog => blog.id !== action.data.id)
        case 'INCREMENT_VOTE':
            return state.map((blog) => blog.id === action.data.id ? { ...blog, likes: action.data.likes } : blog)
        case 'INIT_BLOGS':
            return action.data
        default:
            return state
    }
}

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs
        })
    }
}

export const addBlog = (blog) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blog)
        dispatch({
            type: 'ADD_BLOG',
            data: newBlog
        })
    }
}

export const deleteBlog = (id) => {
    return async (dispatch) => {
        await blogService.deleteBlog(id)
        dispatch({
            type: 'DELETE_BLOG',
            data: { id }
        })
    }
}

export const addVote = (blog) => {
    return async (dispatch) => {
        const blogObjectUpdated = { ...blog, likes: blog.likes + 1 }
        const response = await blogService.update(blog.id, blogObjectUpdated)
        dispatch({
            type: 'INCREMENT_VOTE',
            data: response
        })
    }
}

export default blogReducer