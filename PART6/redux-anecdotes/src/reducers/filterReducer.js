const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'UPDATE_FILTER_MESSAGE':
            return action.message
        default:
            return state
    }   
}

export const filterMessage = (message) => {
    return {
        type: 'UPDATE_FILTER_MESSAGE',
        message
    }
}


export default filterReducer