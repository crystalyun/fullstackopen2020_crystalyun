const addBlog = (data) => {
    return {
        type: 'ADD_BLOG',
        data
    }
}

const deleteBlog = (id) => {
    return {
        type: 'DELETE_BLOG',
        data: { id }
    }
}

myboo = addBlog({content: 'ssibal', id: 1})
myfoo = deleteBlog(3)

console.log(myboo)
console.log(myfoo)