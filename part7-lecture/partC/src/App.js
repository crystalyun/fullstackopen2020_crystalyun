import React, {useState, useEffect} from 'react'
import axios from 'axios'

// you would need `bable-loader` to tell Webpack that this file contains JSX and that babel-loader will preprocess JSX syntax into Javascript code before Webpack can bundle this file all together.

// fetch the notes from the backend with custom hook `useNotes`.
// useNotes can be generalized further. refer to Part 7 exercise `ultimate-hook` , `useResource` custom hook.
const useNotes = (url) => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])
  return notes
}


const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  
  // global constant `BACKEND_URL` dynamically changes its value (either prod backend DB url OR dev backend DB url) depending on the `mode` passed into webpack build npm script.
  const notes = useNotes(BACKEND_URL)

  const handleClick = () => {
      setCounter(counter + 1)
      setValues(values.concat(counter))
  }
  
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>
        press
      </button>
      <div>{notes.length} notes on server!!!^^boo {BACKEND_URL}</div>
    </div>
  )
}

export default App