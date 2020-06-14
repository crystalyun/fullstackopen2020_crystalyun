import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Part = (props) => {
  console.log('poo', props)
  return (
    <>
      <p>{props.name} {props.exercises}</p>
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
    </>
  )
}

const App = () => {
  const mycourse = 'Half Stack application development'
  const mypart1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const mypart2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const mypart3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={mycourse}/>
      <Part name={mypart1.name} exercises={mypart1.exercises} />
      <Part name={mypart2.name} exercises={mypart2.exercises} />
      <Part name={mypart3.name} exercises={mypart3.exercises} />
      <Total exercises1={mypart1.exercises} exercises2={mypart2.exercises} exercises3={mypart3.exercises} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
