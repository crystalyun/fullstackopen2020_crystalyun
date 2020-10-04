import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import notificationReducer from '../features/notification/notificationSlice'
import counterReducer from '../features/counter/counterSlice'
import blogsReducer from '../features/blogs/blogsSlice'
import postsReducer from '../features/blogs/posts/postsSlice'
import usersReducer from '../features/blogs/users/usersSlice'
import commentsReducer from '../features/blogs/comments/commentsSlice'
import { notificationMdl } from '../middleware/notification'
import { combineReducers } from 'redux'

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    notification: notificationReducer,
    blogs: combineReducers({
      status: blogsReducer,
      posts: postsReducer,
      users: usersReducer,
      comments: commentsReducer
    })
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...notificationMdl)
})
