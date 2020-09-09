import axios from 'axios'
import helper from '../utils/helper'

const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl, helper.getAuthHeader())
  return request.then(response => response.data)
}

const create = async blog => {
  const response = await axios.post(baseUrl, blog, helper.getAuthHeader())
  return response.data
}

const update = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog, helper.getAuthHeader())
  return response.data
}

const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, helper.getAuthHeader())
  return response.data
}

const likeBlog = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}/like`, null, helper.getAuthHeader())
  return response.data
}

const unlikeBlog = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}/unlike`, null, helper.getAuthHeader())
  return response.data
}

export default { getAll, create, update, deleteBlog, likeBlog, unlikeBlog }