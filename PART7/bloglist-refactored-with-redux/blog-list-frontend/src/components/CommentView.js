import React from 'react'
import { makeStyles, Grid, Avatar, Typography } from '@material-ui/core'
import helper from '../utils/helper'

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

const CommentView = ({ comment }) => {
  const classes = useStyles()
  const avatarSrc = helper.randomAvatarImageGenerator(1, 71)

  return (
    <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
        <Avatar src={avatarSrc} />
        </Grid>
        <Grid item>
        <Typography className={classes.name} variant="body2">{comment.user.name}</Typography>
        <Typography className={classes.message} variant="body2"> {' '} {comment.message}</Typography>
        </Grid>
    </Grid>
  )
}

export default CommentView