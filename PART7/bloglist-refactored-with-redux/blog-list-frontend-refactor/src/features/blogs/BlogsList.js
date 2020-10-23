import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, Button, Container, Typography, Grid, Dialog } from '@material-ui/core'
import { selectPostIds } from './posts/postsSlice'
import BlogCard from './BlogCard'
import BlogCardSkeleton from './BlogCardSkeleton'
import SortBlogsListOptions from './SortBlogsListOptions'

const BlogsList = () => {
    const blogStatus = useSelector(state => state.blogs.status.fetchAll.status)
    const orderedPostIds = useSelector(selectPostIds)

    console.log('orderedPostIds', orderedPostIds)

    let content

    if (blogStatus === 'loading') {
        content = Array.from(new Array(9)).map((_, index) => (
            <BlogCardSkeleton key={index} />
        ))
    } else if (blogStatus === 'succeeded') {
        content = orderedPostIds.map(postId => (
            <BlogCard
              key={postId}
              postId={postId} 
            //   handleClickOpenBlogModal={}
            />
        ))
    } else if (blogStatus === 'failed') {
        content = <div>error occurred. add error page component.</div>
    }

    return (
        <>  
            <Container maxWidth='lg'>
                <SortBlogsListOptions />
                <Grid container spacing={4}>
                    {content}
                </Grid>
            </Container>
        </>
    )
}

export default BlogsList