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
  console.log('pooboo', props)
  return (
    <>
      <p>{props.name} {props.exercises}</p>
    </>
  )
}

const Content = (props) => {
  const myArray = props.parts
  return (
    <>
      <Part name={myArray[0].name} exercises={myArray[0].exercises} />
      <Part name={myArray[1].name} exercises={myArray[1].exercises} />
      <Part name={myArray[2].name} exercises={myArray[2].exercises} />
    </>
  )
}



const Total = (props) => {
  const myArray = props.parts
  return (
    <>
      <p>Number of exercises {myArray[0].exercises + myArray[1].exercises + myArray[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
