import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook'

/* feedback 
1. css should be DRY 
2. 1 state for notification, not 2 states 
*/

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

const Person = ({ person, handleClick }) => (
  <div>
    <span> {person.name} {person.number} </span>
    <Button text="delete" onClick={() => handleClick(person.id, person.name)}/>
  </div>
)

const Button = ({text, onClick}) => {
  return (
  <button onClick={onClick}>{text}</button>
  )
}


const Persons = ({persons, handleClick}) => {
  const personsList = persons.map(person => <Person key={person.id} person={person} handleClick={handleClick}/>)
  return (
    personsList
  )
}

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={isError? "errorNotification" : "successfulNotification"}>
      {message}
    </div>
  )
}

const App = () => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterName, setFilterName ] = useState('')
  const [ persons, setPersons ] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  // ONLY RUNS ONCE 
  useEffect(() => {
    console.log('effect')
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },[])

  console.log('rendered App')

  const addNewPerson = (event) => {
    event.preventDefault()

    const userExists = (persons.filter(a => a.name === newName)).length > 0
    if (userExists) {
      const isUserUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)
      if (isUserUpdate) {
      const registeredPerson = persons.find(person => person.name === newName)
      const updatedRegisteredPerson = { ...registeredPerson, number: newNumber }
      phonebookService
        .update(registeredPerson.id, updatedRegisteredPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : updatedRegisteredPerson))
          setNotificationMessage(`Changed number of ${returnedPerson.name}`)

          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
        .catch(error => {
          setIsError(true)

          setNotificationMessage(`Information of ${registeredPerson.name} has already been removed from server`)

          setPersons(persons.filter(person => person.name !== registeredPerson.name))

          setTimeout(() => {
            setNotificationMessage(null);
            setIsError(false)
          }, 3000)

      })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotificationMessage(`Added ${returnedPerson.name}`)

          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
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
  
  const handleClick = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      phonebookService
        .deleteID(id)
        .then(() => {
          setPersons(persons.filter(person => id !== person.id))
          setNotificationMessage(`Deleted ${name}`)

          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
    } else {console.log('no state update')}
  }

  const filteredPersonsArray = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} isError={isError}/>

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
};

export default App;