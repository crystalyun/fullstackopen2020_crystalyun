import React, { useState } from 'react';

const PersonForm = ({ newName, newNumber, addNewPerson, handleNameChange, handleNumberChange }) => {
  return (
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
  )
}

const Filter = ({filterName, handleFilterNameChange}) => {
  return (
    <div>
      filter shown with <input value={filterName} onChange={handleFilterNameChange} />
    </div>
  )
}

const Person = ({person}) => (
  <p> {person.name} {person.number} </p>
)

const Persons = ({persons}) => {
  const personsList = persons.map(person => <Person key={person.name} person={person}/>)
  return (
    personsList
  )
}

const App = () => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')

  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const addNewPerson = (event) => {
    event.preventDefault()

    if ((persons.filter(a => a.name === newName)).length > 0) {
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

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value.toLowerCase())
  }

  const filteredPersonsArray = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      
      <h3>add a new</h3>

      <PersonForm newName={newName} newNumber={newNumber} addNewPerson={addNewPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      
      <h3>Numbers</h3>

      <Persons persons={filteredPersonsArray} />

      <br /><br /><div>debug: newName state is : {newName}</div>
      <div>debug: newNumber state is : {newNumber}</div>
      <div>debug: filterName state is : {filterName}</div>

    </div>
  )
}


export default App
