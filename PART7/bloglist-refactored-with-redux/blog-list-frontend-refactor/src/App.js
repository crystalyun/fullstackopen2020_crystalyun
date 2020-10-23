import React, { useEffect } from 'react'
import storage from './utils/storage'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from './features/auth/Login'
import { addCurrentUserFromLocalStorage } from './features/auth/authSlice'
import { fetchBlogs } from './features/blogs/blogsSlice'
import Header from './features/blogs/Header'
import { Route, Switch, useLocation } from 'react-router-dom'
import Hero from './features/blogs/Home/Hero'
import BlogsList from './features/blogs/BlogsList'
import { SingleBlogFullPageView, SingleBlogPopupView} from './features/blogs/SingleBlogView'
import InfiniteScroll from 'react-infinite-scroller'

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const hasMore = useSelector(state => state.blogs.status.fetchAll.hasNext)
  const items = useSelector(state => state.blogs.posts)

  let modal = location.state && location.state.modal

  console.log('isModal', modal)

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
        dispatch(addCurrentUserFromLocalStorage(user))
    }

    dispatch(fetchBlogs())
  },[])

  return (
    <>
      <Header />
      <Switch location={modal || location}>
        <Route
          exact
          path="/"
          render={() => (
            <>
              <Hero />
              <BlogsList /> 
            </>
          )}
        />
        <Route path='/login' component={LoginForm} />
        <Route path='/blogs/:blogId' component={SingleBlogFullPageView} />


      </Switch>
      
      {modal && <Route path='/blogs/:blogId' component={SingleBlogPopupView} />}

    </>
  )
}

export default App
