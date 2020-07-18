import React from 'react'
import Blog from './Blog'
import { render, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('<Blog />', () => {
    let component

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
            <Blog blog={blog} user={user}/>
        )
    })

    test('displays title and author, but does not render its url or number of likes by default', () => {
        // use DOM querySelector to select an element that satisfies the css selector condition and then use jest-dom matcher toHaveTextContent over the HTML element.

        const defaultView = component.container.querySelector('.blogDefaultView')
        expect(defaultView).toHaveTextContent('my blog title')
        expect(defaultView).toHaveTextContent('Crystal Yun')
        expect(defaultView).not.toHaveStyle('display: none')

        const detailedView = component.container.querySelector('.blogDetailsView')
        expect(detailedView).toHaveTextContent('https://naver.com')
        expect(detailedView).toHaveTextContent('likes 8')
        expect(detailedView).toHaveStyle('display: none')
    })
})


