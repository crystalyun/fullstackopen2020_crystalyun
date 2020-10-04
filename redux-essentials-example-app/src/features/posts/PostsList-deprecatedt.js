// import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
// import { PostAuthor } from './PostAuthor'
// import { ReactionButtons } from './ReactionButtons'
// import { TimeAgo } from './TimeAgo'
// import { selectAllPosts, fetchPosts } from './postsSlice'

// let PostExcerpt = ({ post }) => {

//   console.log('rendered PostExcerpt.')
  
//   return (
//     <article className="post-excerpt">
//       <h3>{post.title}</h3>
//       <div>
//         <PostAuthor userId={post.user} />
//         <TimeAgo timestamp={post.date} />
//       </div>
//       <p className='post-content'>{post.content.substring(0, 100)}</p>
//       <ReactionButtons post={post} />
//       <Link to={`/posts/${post.id}`} className='button muted-button'>
//         View Post
//       </Link>
//   </article>
//   )
// }

// /*

// previous problem with PostExcerpt:

// 1. User clicked 'like' button on PostExcerpt#1.
// 2. As a reult, Redux posts: {posts} state updated.
// 3. Because Redux state is updated, as a side-effect, useSelector hook in `PostsList` component also re-runs. [in fact, all other useSelector hooks in different components will all re-run..]
// 4. it finds out that `posts` piece of state has trully been updated, so PostsList re-renders.
// 5. Because PostList has PostExcerpt as a child component, as it renders, it renders all 9 PostExcerpt components. (so that 8 Post Exceprts re-renders, but with no updated DOM. wasted effort.)

// solution : skip rendering other 8 PostExcerpts by wrapping PostExcerpt component in React.memo(). i.e. Skip unncessary renders if props ('post') haven't changed, by comparing 
// if prevProp != currProp => then re-render.
// else if prevProp === currProp => then skip re-rendering.
// */


// PostExcerpt = React.memo(PostExcerpt)

// export const PostsList = () => {
//   const dispatch = useDispatch()
//   const posts = useSelector(selectAllPosts)

//   const postStatus = useSelector(state => state.posts.status)
//   const error = useSelector(state => state.posts.error)

//   useEffect(() => {
//     if (postStatus === 'idle') {
//       dispatch(fetchPosts())
//     }
    
//   }, [postStatus, dispatch])

//   let content 

//   if (postStatus === 'loading') {
//     content = <div className="loader">Loading...</div>
//   } else if (postStatus === 'succeeded') {
//      // Sort posts in reverse chronological order by datetime string
//      // Since array.sort() mutates the existing array, we need to make a copy of state.posts and sort that copy.
//       const orderedPosts = posts
//        .slice()
//        .sort((a,b) => b.date.localeCompare(a.date))
      
//       content = orderedPosts.map(post => (
//         <PostExcerpt key={post.id} post={post} />
//       ))
//   } else if (postStatus === 'error') {
//       content = <div>{error}</div>
//   }

//   return (
//     <section className="posts-list">
//       <h2>Posts</h2>
//       {content}
//     </section>
//   )
// }