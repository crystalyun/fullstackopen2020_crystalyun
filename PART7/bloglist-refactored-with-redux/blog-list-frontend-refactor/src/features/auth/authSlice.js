import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import loginService from '../../services/login'

const initialState = {
    status: 'idle',
    error: null,
    currentUser: {
        username: null,
        name: null,
        token: null,
        role: null,
        id: null
    }
}

export const requestLogin = createAsyncThunk(
    'auth/requestLogin',
    async (credentials, { rejectWithValue }) => {
        const { username, password } = credentials
        try {
            const response = await loginService.login({ username, password })
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }

            return rejectWithValue(err.response.data)
        }
        
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addCurrentUserFromLocalStorage: (state, action) => {
            state.currentUser = action.payload
        },
        logout: (state) => {
            state.currentUser = initialState.currentUser
        }
    },
    extraReducers: {
        [requestLogin.pending]: (state, action) => {
            state.status = 'loading'
            state.error = null
        },
        [requestLogin.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.error = null
            state.currentUser = action.payload
        },
        [requestLogin.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.payload.error
        }
    }
})

export const { addCurrentUserFromLocalStorage, logout } = authSlice.actions

export default authSlice.reducer