const filterReducer = (state = 'ALL', action) => {
  console.log('action hit filter reducer')
  switch (action.type) {
  case 'SET_FILTER':
    return action.filter
  default:
    return state
  }
}

export const filterChange = (filter) => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default filterReducer