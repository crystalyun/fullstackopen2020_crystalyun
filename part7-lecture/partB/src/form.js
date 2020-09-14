import React, { useState } from 'react'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

const App = () => {
    const name = useField('text')
    const bday = useField('date')
    const height = useField('number')

    return (
        <div>
            <form>
                name:
                <input {...name} />
                <br />
                birthdate:
                <input {...bday} />
                <br />
                height:
                <input {...height} />
            </form>
            <div>
                for debugging : {name.value} {bday.value} {height.value}
            </div>
        </div>
    )
}

export default App