// https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape#designing-a-normalized-state

// https://github.com/paularmstrong/normalizr

// https://redux-toolkit.js.org/usage/usage-guide#managing-normalized-data

const { normalize, schema } = require('normalizr')

const data = 
  {
    "likesCount": 2,
    "comments": [
      {
        "message": "hoola",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f59006d857dd9ad681fc9fb"
      },
      {
        "message": "wtf?!",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a93e9536d5e28ec27c359"
      },
      {
        "message": "sd",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a93ff536d5e28ec27c35a"
      },
      {
        "message": "d",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a93ff536d5e28ec27c35b"
      },
      {
        "message": "d",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9401536d5e28ec27c35c"
      },
      {
        "message": "d",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9401536d5e28ec27c35d"
      },
      {
        "message": "d",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9402536d5e28ec27c35e"
      },
      {
        "message": "c",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9cc0536d5e28ec27c361"
      },
      {
        "message": "xcbv",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9cc3536d5e28ec27c362"
      },
      {
        "message": "tiddlytubbie eh o eh eh oh uh oh uh oho yee ttee hee",
        "user": {
          "username": "britney",
          "name": "Britney Spears",
          "id": "5f47079da5d2d40dacccfe86"
        },
        "id": "5f5a9da1536d5e28ec27c363"
      }
    ],
    "title": "Versace Women's Spring-Summer 2018",
    "author": "Crystal Yun",
    "url": "https://crystalyun.com",
    "user": {
      "username": "britney",
      "name": "Britney Spears",
      "id": "5f47079da5d2d40dacccfe86"
    },
    "id": "5f5238beb2acb447a43c5b58",
    "didUserLike": true
  }


// Define a users schema
const user = new schema.Entity('users')

// Define your comments schema
const comment = new schema.Entity('comments', {
    user
})

// Define your post
const post = new schema.Entity('posts', {
    user,
    comments: [comment]
})

const normalizedData = normalize(data, post)
console.log(normalizedData)

const result = 
{
    entities: {
      users: { '5f47079da5d2d40dacccfe86': [Object] },
      comments: {
        '5f59006d857dd9ad681fc9fb': [Object],
        '5f5a93e9536d5e28ec27c359': [Object],
        '5f5a93ff536d5e28ec27c35a': [Object],
        '5f5a93ff536d5e28ec27c35b': [Object],
        '5f5a9401536d5e28ec27c35c': [Object],
        '5f5a9401536d5e28ec27c35d': [Object],
        '5f5a9402536d5e28ec27c35e': [Object],
        '5f5a9cc0536d5e28ec27c361': [Object],
        '5f5a9cc3536d5e28ec27c362': [Object],
        '5f5a9da1536d5e28ec27c363': [Object]
      },
      posts: { '5f5238beb2acb447a43c5b58': [Object] }
    },
    result: '5f5238beb2acb447a43c5b58'
  }