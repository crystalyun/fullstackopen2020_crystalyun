import loginService from '../services/login'
import storage from '../utils/storage'

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

export default signInUserReducer