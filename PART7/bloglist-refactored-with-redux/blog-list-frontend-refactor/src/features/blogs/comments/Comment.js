import React from 'react'
import { makeStyles, Grid, Avatar, Typography } from '@material-ui/core'
import helper from '../../../utils/helper'
import { useSelector } from 'react-redux'
import { selectCommentById } from './commentsSlice'
import { selectUserById } from '../users/usersSlice'

const useStyles = makeStyles(() => ({
    name: {
        fontWeight: '600',
        fontSize: '12.5px',
        display: 'inline'
    },
    message: {
        display: 'inline'
    }
}))

const Comment = ({ commentId }) => {
    const classes = useStyles()
    const comment = useSelector(state => selectCommentById(state, commentId))
    const author = useSelector(state => selectUserById(state, comment.user))
    const avatarSrc = helper.randomAvatarImageGenerator(1, 71)

    return (
    <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
        <Avatar src={avatarSrc} />
        </Grid>
        <Grid item>
        <Typography className={classes.name} variant="body2">{author.name}</Typography>
        <Typography className={classes.message} variant="body2"> {' '} {comment.message}</Typography>
        </Grid>
    </Grid>        
    )
}

export default Comment