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
  return (
    <>
      <p>{props.partName} {props.partExercises}</p>
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
  const mypart1 = 'Fundamentals of React'
  const myexercises1 = 10
  const mypart2 = 'Using props to pass data'
  const myexercises2 = 7
  const mypart3 = 'State of a component'
  const myexercises3 = 14

  return (
    <div>
      <Header course={mycourse}/>
      <Part partName={mypart1} partExercises={myexercises1} />
      <Part partName={mypart2} partExercises={myexercises2} />
      <Part partName={mypart3} partExercises={myexercises3} />
      <Total exercises1={myexercises1} exercises2={myexercises2} exercises3={myexercises3} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
