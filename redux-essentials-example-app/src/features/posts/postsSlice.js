import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// Sort posts in reverse chronological order by datetime string
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.data)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  console.log('fetching posts...')
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    // The response includes the complete post object, including unique ID
    console.log('server finished creating new post : ', response.post)
    return response.post
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action) {
      // payload includes the ID of the post being updated, the new title and content fields that the user typed in. {type: 'posts/postUpdated', payload: {id, title, content}}
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      // we need to know the ID of the post, and which reaction button the user clicked on. We'll have our action.payload be an object that looks like {postId, reaction}.
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: {
    // https://redux-toolkit.js.org/api/createAsyncThunk
    // API call loading state can be tracked in Redux store state and pulled from React component if necessary (PostList.js)
    // Alternatively, loading state can be saved directly in React component state (AddPostForm.js)
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      // Use the `upsertMany` reducer as a mutating update utility
      postsAdapter.upsertMany(state, action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // omit posts loading reducers
    // `We could track the request status in 'postsSlice' using a second loading enum if we wanted to, but for this example let's keep the loading state tracking limited to the component.`
    // Use the `addOne` reducer for the fulfilled case
    [addNewPost.fulfilled]: postsAdapter.addOne
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)


// memoized selector
export const selectPostsByUser = createSelector(
  // Memoized selectors will only recalculate the results if the input selectors return new values
  [selectAllPosts, (_, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)