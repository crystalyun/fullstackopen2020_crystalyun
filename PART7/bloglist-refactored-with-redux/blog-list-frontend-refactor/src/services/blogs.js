import axios from 'axios'
import helper from '../utils/helper'

const baseUrl = '/api/blogs'

const getBlogs = ({ token, nextUrl }) => {
  const request = axios.get(`${nextUrl}`, helper.makeAuthHeader(token))
  return request.then(response => response.data)
}

const create = async ({ blog, token }) => {
  const response = await axios.post(baseUrl, blog, helper.makeAuthHeader(token))
  return response.data
}

const update = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog, helper.makeAuthHeader())
  return response.data
}

const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, helper.makeAuthHeader())
  return response.data
}

const likeBlog = async ({ token, postId }) => {
  const response = await axios.post(`${baseUrl}/${postId}/like`, null, helper.makeAuthHeader(token))
  return response.data
}

const unlikeBlog = async ({ token, postId }) => {
  const response = await axios.post(`${baseUrl}/${postId}/unlike`, null, helper.makeAuthHeader(token))
  return response.data
}

export default { getBlogs, create, update, deleteBlog, likeBlog, unlikeBlog }