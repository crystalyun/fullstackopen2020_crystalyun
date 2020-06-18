import React, { useState } from 'react';

const App = () => {
  const [ newName, setNewName ] = useState('')
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ])

  const addName = (event) => {
    event.preventDefault()

    if ((persons.filter(person => person.name === newName)).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName
      }
      setPersons(persons.concat(personObject))
    }
    setNewName('')
  }

  const handleNameChange= (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name}</p>)}

      <br /><br /><div>debug: newName state is : {newName}</div>
    </div>
  )
}


export default App