import React from 'react'
import BlogForm from './BlogForm'
import { render, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'

test('form calls the event handler it received as props with the right details when a new blog is called.', async () => {
  const promise = Promise.resolve()
  const createBlogMockFunction = jest.fn(() => promise)

  const component = render(
    <BlogForm handleCreateNewBlog={createBlogMockFunction}/>
  )

  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('#Title')
  const authorInput = component.container.querySelector('#Author')
  const urlInput = component.container.querySelector('#Url')

  fireEvent.change(titleInput, {
    target: { value: 'testing of forms could be easier' }
  })

  fireEvent.change(authorInput, {
    target: { value: 'Crystal Yun' }
  })

  fireEvent.change(urlInput, {
    target: { value: 'https://naver.com' }
  })

  // debug
  // console.log(prettyDOM(form))

  fireEvent.submit(form)

  const newBlog = {
    title: 'testing of forms could be easier',
    author: 'Crystal Yun',
    url: 'https://naver.com'
  }

  expect(createBlogMockFunction.mock.calls).toHaveLength(1)
  expect(createBlogMockFunction.mock.calls[0][0]).toEqual(newBlog)
  // alternatively, can test like this with jest custom matcher
  expect(createBlogMockFunction).toHaveBeenCalledWith(newBlog)
  await act(() => promise) // to suppress act warning : https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
})