import storage from '../utils/storage'

// `max` exclusive and the `min` inclusive integer returned
const randomAvatarImageGenerator = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    const random = Math.floor(Math.random() * (max - min) + min)
    return `http://i.pravatar.cc/300?img=${random}`
}

const getAuthHeader = () => {
    return {
      headers: { Authorization: `bearer ${storage.loadUser().token}` }
    }
}

export default {
    randomAvatarImageGenerator,
    getAuthHeader,
}