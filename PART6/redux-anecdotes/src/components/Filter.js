import React from 'react'
import { useDispatch } from 'react-redux'
import { filterMessage } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        // input-field value is in variable event.target.value
        console.log('print out what is typed : ', event.target.value)
        dispatch(filterMessage(event.target.value))
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter