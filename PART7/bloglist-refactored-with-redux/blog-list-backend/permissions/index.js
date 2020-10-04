const isAdminOrAuthorSelf = (user,blog) => {
    return (
        user.role === 'ADMIN' ||
        String(blog.user) === String(user.id)
    )
}

module.exports = {
    isAdminOrAuthorSelf,
}
