const isUserFoundInLocalStorageReducer = (state = null, action) => {
    switch (action.type) {
        case 'FOUND':
            return true
        case 'NOT_FOUND':
            return false
        case 'RESET':
            return null
        default:
            return state
    }
}

export const UserFoundInLocalStorage = () => {
    return {
        type: 'FOUND'
    }
}

export const UserNotFoundInLocalStorage = () => {
    return {
        type: 'NOT_FOUND'
    }
}

export const ResetUserFoundInLocalStorageStatus = () => {
    return {
        type: 'RESET'
    }
}


export default isUserFoundInLocalStorageReducer