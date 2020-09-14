import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

/* Toggle functionality. can swap out {props.children} component.
in this project, `LoginForm` and `NoteForm` are a children of `Toggleable` component.

1. click a button with label {props.buttonlabel}
2. it then shows {props.children} and a cancel button.
   Button with label {props.buttonLabel} disappears
3. when a cancel button is clicked, {props.children} and a cancel button disappears. Instead, Button with label {props.buttonLabel} reappears.
*/

// Toggleable component take a ref they receive, and pass it further down (ref "forward") to a child. (in this case, the child is `toggleVisibility` function)

// this way, components using Toggleable (in this case, App component) can get a ref to the underlying `toggleVisibility` function and access it if necessary-just like if App component triggers a toggleVisibility function directly.
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  console.log('rendering Togglable..')

  // Toggleable component uses the `useImpreativeHandle` hook to make its toggleVisibility function available outside the component.
  useImperativeHandle(ref, () => ({
    toggleVisibility: () => {
      toggleVisibility()
    }
  }))

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable