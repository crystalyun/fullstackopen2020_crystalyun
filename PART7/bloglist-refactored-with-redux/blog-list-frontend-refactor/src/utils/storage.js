const storageKey = 'loggedBlogappUser'

const saveUser = (user) =>
  localStorage.setItem(storageKey, JSON.stringify(user))

const removeUser = () =>
  localStorage.removeItem(storageKey)

const loadUser = () =>
  JSON.parse(localStorage.getItem(storageKey))

export default {
  saveUser,
  removeUser,
  loadUser
}