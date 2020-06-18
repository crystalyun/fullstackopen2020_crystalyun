import React, { useState } from 'react';

const App = () => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas',
      number: '6969-6969-6969'
    }
  ])

  const addNewPerson = (event) => {
    event.preventDefault()

    if ((persons.filter(person => person.name === newName)).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange= (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}

      <br /><br /><div>debug: newName state is : {newName}</div>
      <div>debug: newNumber state is : {newNumber}</div>
    </div>
  )
}


export default App