// import React, { useState } from 'react'
// import { Link as RouterLink } from 'react-router-dom'
// import { makeStyles, Button, AppBar, Container, Toolbar, Typography, Link, Avatar, Menu, MenuItem } from '@material-ui/core'
// import { deepOrange } from '@material-ui/core/colors'
// import { useSelector, useDispatch } from 'react-redux'
// import helper from '../../utils/helper'
// import { logout } from '../auth/authSlice'

// const avatarSrc = helper.randomAvatarImageGenerator(1,71)

// const useStyles = makeStyles((theme) => ({
//     appBar: {
//       backgroundColor: '#FFFFFF',
//     },
//     orange: {
//         color: theme.palette.getContrastText(deepOrange[500]),
//         backgroundColor: deepOrange[500],
//     },
// }))

// const LoggedOutView = props => {
//     const classes = useStyles()

//     if (!props.currentUser.name) {
//         return (
//             <>
//                 <Button to='/login' color="primary" variant="contained" component={RouterLink}>Login</Button>
//             </>
//         )
//     }

//     return null
// }

// const LoggedInView = props => {
//     const classes = useStyles()
//     const dispatch = useDispatch()
//     const [anchorEl, setAnchorEl] = useState(null)

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget)
//     }

//     const handleClose = () => {
//         setAnchorEl(null)
//     }

//     const handleLogout = () => {
//         dispatch(logout())
//         handleClose()
//     }

//     if (props.currentUser.name) {
//         return (
//             <>
//                 <Avatar src={avatarSrc} alt={props.currentUser.name} className={classes.orange} onClick={handleClick} />
//                 <Menu
//                     id="simple-menu"
//                     anchorEl={anchorEl}
//                     keepMounted
//                     open={Boolean(anchorEl)}
//                     onClose={handleClose}
//                 >
//                     <UserMenu handleClose={handleClose} currentUser={props.currentUser} handleLogout={handleLogout} />

//                     <AdminMenu handleClose={handleClose} currentUser={props.currentUser} handleLogout={handleLogout}/>
//                 </Menu>
//             </>

//         )
//     }

//     return null
// }

// const Header = () => {
//     const classes = useStyles()
//     const currentUser = useSelector(state => state.auth.currentUser)

//     return (
//         <>
//             <AppBar position="fixed" className={classes.appBar}>
//                 <Container maxWidth="lg">
//                 <Toolbar>
//                     <Typography variant="h6" style={{ margin: '0px 25px 0px 0px', flex: '1' }}>
//                         <Link to='/' component={RouterLink} color="inherit">Blog</Link>
//                     </Typography>

//                     <LoggedOutView currentUser={currentUser} />

//                     <LoggedInView currentUser={currentUser} />

//                 </Toolbar>
//                 </Container>
//             </AppBar>

//             <Toolbar />
//         </>
//     )
// }

// // problem
// const UserMenu = ({ handleClose, currentUser, handleLogout }) => {
//     if (currentUser.role === 'USER') {
//         return (
//             <>
//                 <MenuItem to={`/users/${currentUser.id}`} onClick={handleClose} component={RouterLink}>My Posts</MenuItem>
//                 <MenuItem to='/' onClick={handleLogout} component={RouterLink}>Logout</MenuItem>
//             </>
//         )
//     }

//     return null
// }


// // problem
// const AdminMenu = ({ handleClose, currentUser, handleLogout }) => {
//     if (currentUser.role === 'ADMIN') {
//         return (
//             <>
//                 <MenuItem to={`/users/${currentUser.id}`} onClick={handleClose} component={RouterLink}>My Posts</MenuItem>
//                 <MenuItem to='/users' onClick={handleClose} component={RouterLink}>Manage Users</MenuItem>
//                 <MenuItem to='/' onClick={handleLogout} component={RouterLink}>Logout</MenuItem>
//             </>
//         )
//     }

//     return null
// }

// export default Header