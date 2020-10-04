import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { selectAllPosts, fetchPosts, selectPostById, selectPostIds } from './postsSlice'

/*
For optimized re-rendering, either use `React.memo()` OR normalize Redux state in a standardized format. e.g. { ids: [1, 2, 3], entities: { 1: { reactions, content, date }, 2: {...}, 3: {...} } }. PostsList-deprecated showcases first approach, whilst this file shows the latter.
*/

const PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))

  console.log('rendered PostExcerpt.')
  
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className='post-content'>{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>
        View Post
      </Link>
  </article>
  )
}

/*
1. User clicked 'like' button on PostExcerpt#1.
2. As a result, Redux state updates, and as a side-effect, useSelector hooks in PostsList determines if PostsList need to re-render.
3. Because orderedPostIds stay the same, and the same for postStatus&error, PostsList does not need to re-render for now.
4. At the same time, as a side-effect to Redux state update to `like`, useSelector hook in PostExcerpt#1 instance also determines if it needs to re-render.
5. PostExcerpt#1 finds out its like field has been updated. So it re-renders.
6. All other 8 PostExcerpt instances also has useSelector hook, but it decides no need to re-render since its `post` state that is in charge of did not update.
7. as a result, only 1 re-render happens for when a user like a blog post. PostExcerpt#1.

context : 
In React, when a child component re-renders, a parent component does not re-render.
However, when a parent component re-renders, ALL its child components re-render, unconditionlly.

When Redux state updates, ALL useSelector hook in ALL components determine if the component they are in need to re-render. If the piece of state that useSelector hook queries has been updated, then that component re-renders. Otherwise, useSelector hook tells the component no need to re-render as the state it is in charge of did not update.

*/

export const PostsList = () => {
  const dispatch = useDispatch()
  // Now PostsLists will only need to re-render when that IDs array changes.. ( i.e. when posts are added or removed. Contra this situation to before when PostsLists and all other 8 PostExcerpts had to re-render with no DOM-update when a user clicked like button on PostExcerpt#1.)
  const orderedPostIds = useSelector(selectPostIds) //["1", "2", "3" ...]. pulls out 'ids' field from `posts` slice.

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
    
  }, [postStatus, dispatch])

  let content 

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
      content = orderedPostIds.map(postId => (
        <PostExcerpt key={postId} postId={postId} />
      ))

  } else if (postStatus === 'error') {
      content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}