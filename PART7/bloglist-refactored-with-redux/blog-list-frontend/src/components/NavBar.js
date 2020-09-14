import React from 'react'
import Notification from './Notification'
import { makeStyles, Button, AppBar, Container, Toolbar, Typography, Link } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { logOutUser } from '../reducers/signInUserReducer'
import { Link as RouterLink, useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    appBar: {
      backgroundColor: '#FFFFFF',
    },
    link: {
      margin: theme.spacing(1, 1),
    },
}))

const NavBar = ({ userName }) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const notification = useSelector(state => state.notification)
    
    const handleLogout = () => {
        dispatch(logOutUser())
        history.push('/')
    }

    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Container maxWidth="lg">
                <Toolbar>
                    <Typography variant="h6" style={{ margin: '0px 25px 0px 0px' }}>
                    Blog
                    </Typography>
                    <Link to='/' component={RouterLink} className={classes.link}>HOME</Link>
                    <Link to='/users' component={RouterLink} className={classes.link} style={{ flex: '1' }}>USERS</Link>
                    <Typography variant="body2" style={{ color: '#442C2E', marginRight: '5px'}}><b>{userName}</b> logged in</Typography>
                    <Button color="primary" variant="contained" onClick={handleLogout}>Log out</Button>
                </Toolbar>
                </Container>
            </AppBar>

            <Toolbar />

            <Container maxWidth="lg">
                <Notification notification={notification} />
            </Container>
        </>
    )
}

export default NavBar