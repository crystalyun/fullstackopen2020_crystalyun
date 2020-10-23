import React, { useState } from 'react'
import {
    makeStyles,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { sortPosts } from './posts/postsSlice'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 250,
    float: 'right',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))


const SortBlogsListOptions = () => {
    const dispatch = useDispatch()
    const sortOption = useSelector(state => state.blogs.status.sortOption)
    const classes = useStyles()

    const handleChange = (event) => {
        dispatch(sortPosts(event.target.value))
    }

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>sort</InputLabel>
            <Select
            value={sortOption}
            onChange={handleChange}
            label="sortOption"
            >
            <MenuItem value={'createdAt'}>Newest</MenuItem>
            <MenuItem value={'likesCount'}>Most Liked</MenuItem>
            <MenuItem value={'commentsCount'}>Most Commented</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SortBlogsListOptions