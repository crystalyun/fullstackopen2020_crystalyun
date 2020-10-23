import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles, Grid, Card, CardContent, CardActionArea, CardActions } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 284,
        height: 380,
        borderRadius: 12,
        position: 'relative'
    },
    cardMedia: {
        paddingTop: '80.25%'
    },
    cardActions: {
        position: 'absolute',
        bottom: 0,
    }
}))

const BlogCardSkeleton = () => {
    const classes = useStyles()

    return (
        <Grid item xs={12} sm={6} md={3} align="center">
            <Card className={classes.card} >
                <CardActionArea>
                    <Skeleton
                        variant='rect'
                        animation='wave'
                        className={classes.cardMedia}
                    />
                    <CardContent>
                        <Skeleton variant='text' animation='wave' height={20}/>
                        <Skeleton variant='text' animation='wave' width='80%' height={20}/>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing className={classes.cardActions}>
                    <Skeleton
                        variant='rect'
                        animation='wave'
                        height={20}
                        width={100}
                    />
                </CardActions>
            </Card>
        </Grid>
    )
}

export default BlogCardSkeleton