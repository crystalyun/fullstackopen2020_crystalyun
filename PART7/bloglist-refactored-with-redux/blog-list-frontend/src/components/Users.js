import React, { useState, useEffect } from 'react'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService
      .getAll()
      .then(response => setUsers(response))
  },[])

  const headings = [
    '',
    'blogs created'
  ]

  const match = useRouteMatch('/users/:id')
  const user = match
    ? users.find(user => user.id === match.params.id)
    : null

  return (
    <>
      <Switch>
        <Route path='/users/:id'>
          <User user={user} />
        </Route>
        <Route path='/users'> 
        <h2>Users</h2>
          <table>
            <thead>
              <tr>
                {headings.map(h => 
                  <th key={h}>{h}</th>           
                )}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                return (
                  <tr key={user.id}>  
                    <td>
                      <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </td>
                    <td>
                      {user.blogs.length}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Route>
      </Switch>
    </>
  )
}

/*
NB: you will almost certainly stumble across the following error message during this exercise: TypeError: Cannot read property 'name' of undefined

The error message will occur if you refresh the page for an individual user.

The cause of the issue is that when we navigate directly to the page of an individual user, the React application has not yet received the data from the backend. One solution for fixing the problem is to use conditional rendering:

*/

const User = ({ user }) => {
  if (!user) {
    console.log('entered !user condition')
    return null
  } else {
    console.log('did not enter !user condition')
  }

  return (
    <>
      <h2>{user.name}</h2>

      <h4>added blogs</h4>

      <ul>
        {user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </>
  )
}

export default Users