import React from 'react'
import Blog from './Blog'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { prettyDOM } from '@testing-library/dom'

describe('<Blog />', () => {
  let component

  const mockClickHandler = jest.fn()

  const blog = {
    id: 1,
    title: 'my blog title',
    url: 'https://naver.com',
    likes: 8,
    author: 'Crystal Yun',
    user: {
      id: 1,
      name: 'Joshua Shen',
      username: 'CuddlyPuff'
    }
  }

  const user = {
    name: 'Joshua Shen',
    username: 'CuddlyPuff',
    token: 'eyJHbgRE'
  }

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        user={user}
        handleIncrementLikesByOne={mockClickHandler}
        handleRemoveBlog={() => {}}
      />
    )
  })

  test('displays title and author, but does not render its url or number of likes by default', () => {
    expect(component.getByText(blog.title)).toBeVisible()
    expect(component.getByText(blog.author)).toBeVisible()
    expect(component.getByText(blog.url)).not.toBeVisible()
    expect(component.getByText(`likes ${blog.likes}`)).not.toBeVisible()
  })

  test('when view button is clicked, the component shows detailed view of a blog including url and number of likes', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    expect(component.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    expect(component.getByText(blog.url)).toBeVisible()
    expect(component.getByText(`likes ${blog.likes}`)).toBeVisible()
  })

  test('when like button is clicked twice, the event handler the component received as props is called twice.', () => {
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockClickHandler.mock.calls).toHaveLength(2)

    expect(mockClickHandler).toHaveBeenCalledWith(blog)
  })
})


