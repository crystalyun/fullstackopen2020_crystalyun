import axios from 'axios'

const baseUrl = '/api/blogs'

const getAllByBlogId = (blogId) => {
    const request = axios.get(`${baseUrl}/${blogId}/comments`)
    return request.then(response => response.data)
}

const create = async (blogId, comment) => {
    const response = await axios.post(`${baseUrl}/${blogId}/comments`, comment)
    return response.data
}

export default { getAllByBlogId, create }