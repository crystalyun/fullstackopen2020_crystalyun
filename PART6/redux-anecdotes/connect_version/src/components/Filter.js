import React from 'react'
import { connect } from 'react-redux'
import { filterMessage } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    console.log('print out what is typed : ', event.target.value)

    props.filterMessage(event.target.value)
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

// // redux connect() style 2
export default connect(
  null,
  { filterMessage }
)(Filter)
