import axios from 'axios'
import helper from '../utils/helper'

const baseUrl = '/api/blogs'

const getAll = ({ token }) => {
  const request = axios.get(baseUrl, helper.makeAuthHeader(token))
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

const likeBlog = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}/like`, null, helper.makeAuthHeader())
  return response.data
}

const unlikeBlog = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}/unlike`, null, helper.makeAuthHeader())
  return response.data
}

export default { getAll, create, update, deleteBlog, likeBlog, unlikeBlog }