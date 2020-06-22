import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook'
import axios from 'axios';



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

const Person = ({ person, handleClick, value }) => (
  <div>
    <span> {person.name} {person.number} </span>
    <Button text="delete" onClick={handleClick} value={value} name={person.name} />
  </div>
)

const Button = ({text, onClick, value, name}) => {
  return (
  <button onClick={onClick} value={value} name={name} >{text}</button>
  )
}


const Persons = ({persons, handleClick}) => {
  const personsList = persons.map(person => <Person key={person.id} person={person} handleClick={handleClick} value={person.id} />)
  return (
    personsList
  )
}

const App = () => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')

  const [ persons, setPersons ] = useState([])
  
  // ONLY RUNS ONCE 
  useEffect(() => {
    console.log('effect')
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },[])

  console.log('rendered', persons.length, 'persons')

  const addNewPerson = (event) => {
    event.preventDefault()

    if ((persons.filter(a => a.name === newName)).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
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

  // event.target.value is a string, person.id is a number 
  const handleClick = (event) => {
    const id = event.target.value
    if (window.confirm(`Delete ${event.target.name} ?`)) {
      phonebookService.deleteID(id)
      .then(response => {
        setPersons(persons.filter(person => parseInt(id) !== person.id))
      })
    } else {console.log('no state update')}
  }

  const filteredPersonsArray = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      
      <h3>add a new</h3>

      <PersonForm newName={newName} newNumber={newNumber} addNewPerson={addNewPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      
      <h3>Numbers</h3>

      <Persons persons={filteredPersonsArray} handleClick={handleClick} />

      <br /><br /><div>debug: newName state is : {newName}</div>
      <div>debug: newNumber state is : {newNumber}</div>
      <div>debug: filterName state is : {filterName}</div>

    </div>
  )
}

export default App