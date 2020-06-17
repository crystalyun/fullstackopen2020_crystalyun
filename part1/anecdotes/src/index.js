import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({text,onClick}) => <button onClick={onClick}>{text}</button>

const Display = ({heading,text,votesCount}) => {
  return (
    <div>
      <h1>{heading}</h1>
      {text} <br />
      has {votesCount} votes
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(props.anecdotes.length).fill(0))

  const changeSelectedbyRandomNumber = () => {
    const randomNumber = Math.floor((Math.random()* (props.anecdotes.length)))
    console.log('randomNumber is', randomNumber)
    setSelected(randomNumber)
  }

  const increaseVotesByOne = () => {
    const copy = [...votes]
    copy[selected] +=1 
    setVotes(copy)
  }

  const maxVote = votes.indexOf(Math.max(...votes))
  
  return (
    <div>
      <Display heading='Anecdote of the day' text={props.anecdotes[selected]} votesCount={votes[selected]}/>
      <div>
       <Button text='next anecdote' onClick={() => changeSelectedbyRandomNumber()} />
       <Button text='vote' onClick={() => increaseVotesByOne()} />
      </div>
      <Display heading='Anecdote with most votes' text={props.anecdotes[maxVote]} votesCount={votes[maxVote]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes}/>,
  document.getElementById('root')
)





