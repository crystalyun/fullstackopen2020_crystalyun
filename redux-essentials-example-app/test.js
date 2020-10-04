const {sub} = require('date-fns')

const notifications = [{id : 1, content: 'shibal', date: sub(new Date(), { minutes: 50 }).toISOString()}, {id: 2, content: 'bullshit', date: sub(new Date(), { minutes: 40 }).toISOString()}]

const pushNotifications = [{id : 3, content: 'fuck', date: sub(new Date(), { minutes: 30 }).toISOString()}, {id: 4, content: 'thisshit', date: sub(new Date(), { minutes: 20 }).toISOString()}]

const afterPush = notifications.push(...pushNotifications)

console.log(notifications)
console.log('after added length is ', notifications.length)

notifications.sort((a, b) => b.date.localeCompare(a.date))
console.log('after sorting by date , ', notifications)