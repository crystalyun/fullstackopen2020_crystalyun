import blogService from '../services/blogs'
import commentService from '../services/comments'
import { showNotificationWithTimeout } from './notificationReducer'

const blogReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_BLOG':
            return state.concat(action.data)
        case 'DELETE_BLOG':
            return state.filter(blog => blog.id !== action.data.id)
        case 'INIT_BLOGS':
            return action.data
        case 'ADD_COMMENT': {
            return state.map(blog => {
                if (blog.id === action.data.blog) {
                    delete action.data.blog
                    return { ...blog, comments: blog.comments.concat(action.data) }
                }
                return blog
            })
        }
        case 'UPDATE_LIKE_BLOG':
            return state.map(blog => blog.id === action.data.id ? { ...blog, likesCount: action.data.likesCount, didUserLike: action.data.didUserLike } : blog)
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
        try {
            const newBlog = await blogService.create(blog)
            dispatch({
                type: 'ADD_BLOG',
                data: newBlog
            })
            dispatch(showNotificationWithTimeout({
                message: `a new blog ${blog.title} by ${blog.author} added`,
                error: false,
                seconds: 10
            }))
        } catch (exception) {
            dispatch(showNotificationWithTimeout({
                message: exception.response.data.error,
                error: true,
                seconds: 10
            }))
        }
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

export const likeBlog = (blogId) => {
    return async (dispatch) => {
        try {
            const response = await blogService.likeBlog(blogId)
            dispatch({
                type: 'UPDATE_LIKE_BLOG',
                data: response
            })
        } catch (err) {
            console.error('error : ', err.response.data)
        }
    }
}

export const unlikeBlog = (blogId) => {
    return async (dispatch) => {
        try {
            const response = await blogService.unlikeBlog(blogId)
            dispatch({
                type: 'UPDATE_LIKE_BLOG',
                data: response
            })
        } catch (err) {
            console.error('error : ', err.response.data)
        }
    }
}

export const addComment = (blogId, comment) => {
    return async (dispatch) => {
      const response = await commentService.create(blogId, comment)
      dispatch({
          type: 'ADD_COMMENT',
          data: response
      })
    }
}

export default blogReducer