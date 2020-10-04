// `max` exclusive and the `min` inclusive integer returned
const randomAvatarImageGenerator = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    const random = Math.floor(Math.random() * (max - min) + min)
    return `http://i.pravatar.cc/300?img=${random}`
}

const makeAuthHeader = (token) => {
    return token ? { headers: { Authorization: `bearer ${token}` } } : null
}

export default {
    randomAvatarImageGenerator,
    makeAuthHeader,
}



