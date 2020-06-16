import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return(
      <div>No feedback given</div>
    )
  }

  return(
    <div>
      <Statistic text='good' calc={good}/>
      <Statistic text='neutral' calc={neutral}/>
      <Statistic text='bad' calc={bad}/>
      <Statistic text='all' calc={good + neutral + bad}/>
      <Statistic text='average' calc={(good-bad)/(good+neutral+bad) || 0}/>
      <Statistic text='positive' calc={((good)/(good+neutral+bad))*100 || 0} />
    </div>
  )
}

const Statistic = ({ text,calc }) => {
  if (text === 'positive') {
    return(
      <p>{text} {calc} %</p>
    )
  }

  return(
    <p>
      {text} {calc}
    </p>
  )
}

const Button = ({text,onClick}) => <button onClick={onClick}>{text}</button>

      
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' onClick={() => setGood(good + 1)}/>
      <Button text='neutral' onClick={() => setNeutral(neutral + 1)}/>
      <Button text='bad' onClick={() => setBad(bad + 1)}/>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

