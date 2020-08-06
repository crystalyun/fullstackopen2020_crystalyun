import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Form field custom hook
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

// Country API custom hook. country.found and country.data are custom property.
const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name === "") {
      return
    }

    console.log('effect to fetch data : ', name)
    axios
      .get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
      .then(response => {
        console.log('promise fulfilled. : ', response.data)
          setCountry({found: true, data: { ...response.data[0] }})
      })
      .catch(() => {
        setCountry({ found: false, data: null })
      })
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  console.log('nameInput ', nameInput)
  console.log('name state ', name)
  console.log('rerender app')

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App

/*

when user types 'nepal' and click find, App renders 8 times to show the user with nepal country data.

1. App renders initially. (count : 1)
2. nameInput.value evaluates to the most recent user input.Because nameInput uses a custom hook `useField`
which has input value as internal state, each keystroke by user re-renders App. so, if user writes `nepal`, App renders 5 times. 
(count: 5)
3. when user clicks find, App's internal state `name` is updated to the same value of nameInput.value. Because App's state has changed,
App renders again. (count : 1)
4. when App re-renders, App invokes useCountry(name) custom hook with updated `name` state. useCountry(name) calls CountryAPI 
and sets an updated `country` state.
5. Because `country` state is an internal state of `useCountry(name)` custom hook that App calls, and `country` state has just been updated,
App rerenders again (count: 1)
6. App's <Country country={country} /> component now reflects the retrieved country data to the user.

*/