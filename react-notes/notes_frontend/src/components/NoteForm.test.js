import React from 'react'
import NoteForm from './NoteForm'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'

test('<NoteForm /> update parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  const component = render(
    <NoteForm createNote={createNote} />
  )

  const form = component.container.querySelector('form')
  const input = component.container.querySelector('input')

  fireEvent.change(input, {
    target: { value: 'testing of forms could be easier' }
  })
  console.log(prettyDOM(input))
  fireEvent.submit(form)

  expect(createNote.mock.calls).toHaveLength(1)

  // The first argument of the first call to the function is an object with property `content`, and whose value is 'testing of forms could be easier'.The second expectation checks, that the event handler is called with the right parameters
  expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier')
})

