import React from 'react'
import Note from './Note'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )

  // To debug :
  // 1. this prints out the entire rendered HTML code
  component.debug()
  // 2. to print out certain DOM nodes,
  const li = component.container.querySelector('li')
  console.log(prettyDOM(li))

  // render returns an object that has several properties. One of the properties is called container, and it contains all of the HTML rendered by the component.
  // console.log('print out render result ', component)

  // method 1 : use "matcher" methods provided by jest-dom library
  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // The last two methods use the methods getByText and querySelector to find an element matching some condition from the rendered component.

  // method 2 : uses the getByText method of the object returned by the render method (react-testing-library method).The method returns the element that contains the given text. An exception occurs if no such element exists.
  const element = component.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  // method 3 : search for a specific element that is rendered by the component with the querySelector method that receives a CSS selector as its parameter.
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the button calls event handler once', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const button = component.getByText('make not important')

  // debug
  console.log(prettyDOM(button))

  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})