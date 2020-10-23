import React from 'react'
import Comment from './Comment'
import { selectPostById } from '../posts/postsSlice'
import { useSelector } from 'react-redux'

const CommentsList = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
    const comments = post.comments // commentsId array ['1', '2', '3']

    return (
        comments.map(commentId => 
            <Comment key={commentId} commentId={commentId} />
        )
    )
}

export default CommentsList