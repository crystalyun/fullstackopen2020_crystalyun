import React, { useState, useEffect } from 'react'
import axios from 'axios'

// useField is a custom hook for Form input fields.
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

// useResource is a custom hook to communicate with app's backend server by making CURD API calls.
// useResource hook can be used for both notes and phone numbers.
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    console.log('effect to fetch initial data from backend')
    axios
      .get(baseUrl)
      .then(response => {
        console.log('promise fulfilled. ', response.data)
        setResources(response.data)
      })
  }, []);

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    console.log('hit the server right', response.data) // for notes, {content: "dude", id: 3}. for persons, {name: "feng bo shen", number: "1892773", id: 3}
    // before returning, push new data to `resources` array
    setResources(resources.concat(response.data))
    return response.data
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  console.log('App rendered')

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App