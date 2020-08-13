const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  }
  const favorite = blogs.reduce(reducer)
  return (({ title, author, likes }) => ({ title, author, likes }))(favorite)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const top = _.chain(blogs)
    .countBy('author')
    .map((value, key) => ({'author': key, 'blogs': value}))
    .maxBy('blogs')
    .value()

  return top
}

// https://dustinpfister.github.io/2018/11/15/lodash_sum/
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const top = _.chain(blogs)
    .groupBy('author')
    .map(( objs, key ) => {
      return {
        'author': key,
        'likes' : _.sumBy(objs, 'likes')
      }
    })
    .maxBy('likes')
    .value()

  return top
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}