import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = ({course}) => {
  const [userInput, setUserInput] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [filteredCountryList, setFilteredCountryList] = useState([]);

  const handleChangeUserInput = event => {
    setUserInput(event.target.value);
  }

  useEffect(() => {
    console.log('effect to fetch data')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled.')
        setCountryList(response.data)
      })
  }, []);

  useEffect(() => {
    const filteredList = countryList.filter(country => country.name.toLowerCase().includes(userInput))
    console.log(`filter countryList by user input ${userInput}`)
    setFilteredCountryList(filteredList);
  }, [userInput]);

  console.log('refresh rerender')

  return (
    <div>
      <CountrySearch userInput={userInput} handleChangeUserInput={handleChangeUserInput}/>
      
      <SearchResultDisplay filteredCountryList={filteredCountryList}/>

      <div><br /><br />
      debug : current userInput {userInput} 
      <br />debug : current filtered country list {filteredCountryList.map(country => <li key={country.alpha3Code}>{country.name}</li>)}
      </div>
    </div>
  )
}

const CountrySearch = ({userInput, handleChangeUserInput}) => {
  return (
    <label>
      find countries <input type="text" value={userInput} onChange={handleChangeUserInput} />
    </label>
  )
}

const SearchResultDisplay = ({filteredCountryList}) => {
  if (filteredCountryList.length === 0) {
    return (<div>zero match</div>)
  } else if (filteredCountryList.length === 1) {
      return (<CountryInfo country={filteredCountryList[0]} />)
  } else if (filteredCountryList.length > 10) {
      return (<div>Too many matches, specify another filter</div>)
  } else {
      return ( 
        <div>
          {filteredCountryList.map(country => <li key={country.alpha3Code}>{country.name}</li>)}
        </div>
      )
  }    
}

const CountryInfo = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt="flag" width="100" height="100"/>
    </div>

  )
}


export default App
