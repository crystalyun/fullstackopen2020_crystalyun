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
    const filteredList = countryList.filter(country => country.name.toLowerCase().includes(userInput.toLowerCase()))
    console.log(`filter countryList by user input ${userInput}`)
    setFilteredCountryList(filteredList);
  }, [userInput]);

  console.log('rerender App component')

  return (
    <div>
      <CountrySearch userInput={userInput} handleChangeUserInput={handleChangeUserInput}/>
      
      <SearchResultDisplay filteredCountryList={filteredCountryList} setUserInput={setUserInput} />

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
  const { filteredCountryList, setUserInput } = props;

  const showCountryInfo = (country) => {
    setUserInput(country.name)
  }

  console.log('rerender SearchResultDisplay component.')

  if (filteredCountryList.length === 0) {
    return (<div>zero match</div>)
  } else if (filteredCountryList.length === 1) {
      return (<CountryInfo country={filteredCountryList[0]} />)
  } else if (filteredCountryList.length > 10) {
      return (<div>Too many matches, specify another filter</div>)
  } else {
    return ( 
      <div>
        {filteredCountryList.map(country => <MapFunction key={country.name} country={country} showCountryInfo={() => showCountryInfo(country)}/>)}
      </div>
    )
  }

}    

const MapFunction = ({country, showCountryInfo}) => {
  return (
    <div>
      <span>{country.name}</span>
      <Button text="show" handleClick={showCountryInfo}/>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
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
      <img src={country.flag} alt="flag" width="100" height="100"/>
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
      <img src={weatherInfo.weather_icons} alt="weather" width="100" height="100" />
      <div><strong>wind : </strong>{weatherInfo.wind_speed} mph direction {weatherInfo.wind_dir}</div>
    </div>
  )
}



export default App
