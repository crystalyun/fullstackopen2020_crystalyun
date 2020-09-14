import React, { useState, useEffect, forwardRef } from 'react'
import NavBar from './NavBar'
import { useSelector } from 'react-redux'
import { Link as RouterLink, Switch, Route, useRouteMatch } from 'react-router-dom'
import userService from '../services/users'
import MaterialTable from 'material-table'
import { Container, Link, makeStyles } from '@material-ui/core'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

const useStyles = makeStyles((theme) => ({
  content: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px'
  },
}))

const Users = () => {
  const [users, setUsers] = useState([])
  const classes = useStyles()
  const loggedOnUser = useSelector(state => state.signedInUser)

  useEffect(() => {
    userService
      .getAll()
      .then(response => setUsers(response))
  },[])

  const columns = [
    { title: 'Name', field: 'name', render: rowData => <Link to={`/users/${rowData.id}`} component={RouterLink}>{rowData.name}</Link> },
    { title: 'Blogs created', field: 'blogs' }
  ]

  const data = users.map(user => {
    return { id: user.id, name: user.name, blogs: user.blogs.length }
  })

  const match = useRouteMatch('/users/:id')
  const user = match
    ? users.find(user => user.id === match.params.id)
    : null

  return (
    <>

      <NavBar userName={loggedOnUser.name}/>

      <Switch>
        <Route path='/users/:id'>
          <User user={user} />
        </Route>
        <Route path='/users'>
          <div className={classes.content}>
            <Container maxWidth="md">
              <MaterialTable
                icons={tableIcons}
                title='Users'
                columns={columns}
                data={data}
                options={{
                  search: true
                }}
              />
            </Container>
          </div>
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
  const classes = useStyles()

  if (!user) {
    console.log('entered !user condition')
    return null
  } else {
    console.log('did not enter !user condition')
  }

  const columns = [
    { title: 'blogs', field: 'blogs', render: rowData => <Link to={`/blogs/${rowData.id}`} component={RouterLink}>{rowData.blogs}</Link> }
  ]

  const data = user.blogs.map(blog => {
    return { blogs: blog.title, id: blog.id }
  })

  return (
    <>
      <div className={classes.content}>
        <Container maxWidth="md">
          <MaterialTable
            icons={tableIcons}
            title={`Added blogs by ${user.name}`}
            columns={columns}
            data={data}
            options={{
              search: true
            }}
          />
        </Container>
      </div>

    </>
  )
}

export default Users