import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [countryList, setCountryList] = useState([]);

  const handleChangeUserInput = event => {
    setUserInput(event.target.value);
  }

  const handleShow = event => {
    console.log('print out event.target.name : ', event.target.name)
    setUserInput(event.target.name)
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
    

  const filterCountryListByUserInput = () => {
    console.log(`filter by user input ${userInput}`)
    if (!userInput) {
      return [];
    }
    const filteredList = countryList.filter(country => country.name.toLowerCase().includes(userInput.toLowerCase()))
    return filteredList;
  }

  console.log('rerender App component')

  return (
    <div>
      <CountrySearch userInput={userInput} handleChangeUserInput={handleChangeUserInput}/>
      <SearchResultDisplay filteredCountryList={filterCountryListByUserInput()} handleShow={handleShow} />
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

const SearchResultDisplay = (props) => {
  const { filteredCountryList, handleShow } = props;

  if (filteredCountryList.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  } else if (filteredCountryList.length > 1) {
    return ( 
      <div>
        {filteredCountryList.map(country =>
        <div key={country.name}>
          <span>{country.name}</span><Button text="show" handleClick={handleShow} name={country.name}/>
        </div> 
        )}
      </div>
    )
  } else if (filteredCountryList.length === 1) {
      return (<CountryInfo country={filteredCountryList[0]} />)
  } else return (<div>zero match</div>)
}


const Button = (props) => {
  return (
    <button name={props.name} onClick={props.handleClick}>
      {props.text}
    </button>
  )
}


const CountryInfo = (props) => {
  const { country } = props;
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={country.name} height="100"/>
      <Weather cityName={country.capital} />
    </div>

  )
}

const Weather = ({cityName}) => {
  const [ weatherInfo, setWeatherInfo ] = useState({});
  
  useEffect(() => {
    console.log('effect to fetch Weather data')
    const myKey = process.env.REACT_APP_API_KEY
    console.log('using key : ', myKey)
    axios
      .get(`http://api.weatherstack.com/current?access_key=${myKey}&query=${cityName}`)
      .then(response => {
        console.log('promise fulfilled.')
        setWeatherInfo(response.data.current)
      })
  }, []);


  return (
    <div>
      <h3>Weather in {cityName}</h3>
      <div><strong>temperature :</strong> {weatherInfo.temperature} Celcius</div>
      <img src={weatherInfo.weather_icons} alt={weatherInfo.weather_descriptions} height="100" />
      <div><strong>wind : </strong>{weatherInfo.wind_speed} km/h direction {weatherInfo.wind_dir}</div>
    </div>
  )
}

export default App
