import React from 'react'
import BlogForm from './BlogForm'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'

test('form calls the event handler it received as props with the right details when a new blog is called.', () => {
  const createBlogMockFunction = jest.fn()

  const component = render(
    <BlogForm handleCreateNewBlog={createBlogMockFunction}/>
  )

  const blogData = {
    author: 'Crystal Yun',
    title: 'testing of forms could be easier',
    url: 'https://naver.com'
  }

  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('#Title')
  const authorInput = component.container.querySelector('#Author')
  const urlInput = component.container.querySelector('#Url')

  fireEvent.change(titleInput, {
    target: { value: blogData.title }
  })

  fireEvent.change(authorInput, {
    target: { value: blogData.author }
  })

  fireEvent.change(urlInput, {
    target: { value: blogData.url }
  })

  // debug
  // console.log(prettyDOM(form))

  fireEvent.submit(form)

  expect(createBlogMockFunction.mock.calls).toHaveLength(1)
  expect(createBlogMockFunction.mock.calls[0][0]).toEqual(blogData)
  // alternatively, can test like this with jest custom matcher
  expect(createBlogMockFunction).toHaveBeenCalledWith(blogData)
})