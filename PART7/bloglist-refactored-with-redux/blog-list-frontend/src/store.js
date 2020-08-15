import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import signInUserReducer from './reducers/signInUserReducer'

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

export default store