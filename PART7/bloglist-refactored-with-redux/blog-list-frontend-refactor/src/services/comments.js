import axios from 'axios'
import helper from '../utils/helper'

const baseUrl = '/api/blogs'

const getAllByBlogId = (blogId) => {
    const request = axios.get(`${baseUrl}/${blogId}/comments`)
    return request.then(response => response.data)
}

const create = async ({ postId, comment, token }) => {
    const response = await axios.post(`${baseUrl}/${postId}/comments`, comment, helper.makeAuthHeader(token))
    return response.data
}

export default { getAllByBlogId, create }