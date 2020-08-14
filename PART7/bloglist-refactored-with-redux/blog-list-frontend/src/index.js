import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import blogService from './services/blogs'
import loginService from './services/login'
import storage from './utils/storage'
import App from './App'
import './index.css'

// blog reducer and action creators
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

// notification reducer and action creators
const notificationReducer = (state = null, action) => {
    switch (action.type) {
        case 'DISPLAY_NOTIFICATION':
            return { message: action.message, error: action.error}
        case 'REMOVE_NOTIFICATION':
            return null
        default:
            return state
    }

}

export const displayNotification = (message, error) => {
    return {
        type: 'DISPLAY_NOTIFICATION',
        message,
        error
    }
}

export const removeNotification = () => {
    return {
        type: 'REMOVE_NOTIFICATION'
    }
}

let timer
export const showNotificationWithTimeout = ({message, error, seconds}) => {
    return (dispatch) => {
        clearTimeout(timer)

        dispatch(displayNotification(message, error))

        timer = setTimeout(() => {
            dispatch(removeNotification())
        }, seconds*1000)
    }
}

// `signed in user reducer` and action creators
const signInUserReducer = (state = null, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return action.data
        case 'LOGOUT_USER':
            return null
        default:
            return state
    }
}

export const loadUser = () => {
    return (dispatch) => {
        const user = storage.loadUser()
        dispatch({
            type: 'LOGIN_USER',
            data: user
        })
    }
}

export const logInUser = (username, password) => {
    return async (dispatch) => {
        const user = await loginService.login({
            username,
            password
        })
        console.log('user logged in is ', user) // `user` is a javascript object in the form of { token, username, name }
        storage.saveUser(user)
        dispatch({
            type: 'LOGIN_USER',
            data: user
        })
        return user
    }
}

export const logOutUser = () => {
    return (dispatch) => {
        storage.logoutUser()
        dispatch({
          type: 'LOGOUT_USER'
        })
    }
}

// combine reducers
const reducer = combineReducers({
    blogs: blogReducer,
    notification: notificationReducer,
    signedInUser: signInUserReducer
})


// initialize central Redux state store
const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root')
)