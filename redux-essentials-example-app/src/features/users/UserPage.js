import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts } from '../posts/postsSlice'
import { selectPostsByUser } from '../posts/postsSlice'
/*
problem for `postsForUser`

context : user clicks `Refresh Notifications` button whilst on UserPage.(/user/:userId)

1. state change happened in NotificationsSlice
2. useSelector function in UserPage (i.e. `postsForUser`) also reruns, as a side-effect to Redux store update.
3.The useSelector function uses `array.filter` method, which creates a new array reference everytime it is run. (cf. array.filter creates a new array)
4.Although nothing has been changed in UsersPage and the state it uses, UsersPage renders again due to reference update.(unnecessary render)

solution : use memoized selector function `selectPostsByUser`, whose dependency input is `state.posts` and `userId`. As long as the two do not change, you won't get unnecessary rerenders.
*/



// path="/users/:userId"
export const UserPage = ({ match }) => {
    const { userId } = match.params

    const user = useSelector(state => selectUserById(state, userId))

    const postsForUser = useSelector(state => selectPostsByUser(state, userId))
    // const postsForUser = useSelector(state => {
    //     const allPosts = selectAllPosts(state)
    //     return allPosts.filter(post => post.user === userId)
    // })

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    console.log('UserPage rerendered.')

    return (
        <section>
            <h2>{user.name}</h2>
            
            <ul>{postTitles}</ul>
        </section>
    )


}