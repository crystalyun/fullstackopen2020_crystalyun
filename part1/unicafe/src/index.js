import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Statistics = (props) => {
  let percentageStr = '%'
  if ((props.label) === 'positive') {
    return (<p>{props.label} {props.value} {percentageStr} </p>)
  }
  
  return <p>{props.label} {props.value}</p>
}

      
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <h1>statistics</h1>
      <Statistics label='good' value={good} />
      <Statistics label='neutral' value={neutral} />
      <Statistics label='bad' value={bad} />
      <Statistics label='all' value={good + neutral + bad} />
      <Statistics label='average' value={(good-bad)/(good+neutral+bad) || 0} />
      <Statistics label='positive' value={((good)/(good+neutral+bad))*100 || 0} /> 
    </div>
  )
}





ReactDOM.render(<App />, document.getElementById('root'))

