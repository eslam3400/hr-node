const UserModel = require('../Model/UserModel')
const AttendanceModel = require('../Model/AttendanceModel')

let barcodePage = (req, res) => res.render('barcode', { msg: null })

let changeStatue = (user) => {
  if (user.statue == 'offline') return new UserModel().update({ statue: 'online' }, `id = ${user.id}`)
  else if (user.statue == 'online') return new UserModel().update({ statue: 'offline' }, `id = ${user.id}`)
}

let checkIfUserAlreadyCheckedin = async (user) => {
  let attendance = await new AttendanceModel().get({ where: `user_id = ${user.id} AND day = '${getDate('today')}'` })
  return (attendance.length === 1)
}

let checkIn = async (user) => {
  new AttendanceModel().add({ user_id: user.id })
  changeStatue(user)
}

let checkOut = async (user) => {
  let attendance = await new AttendanceModel().get({ where: `user_id = ${user.id} AND day = '${getDate('today')}'` })
  user.startTime = attendance[0].start
  user.endTime = getTime()
  if (attendance.length == 1) new AttendanceModel().update({ finsih: getTime(), worked_time: calculateWorkedTime(user) }, `user_id = ${user.id} AND day = '${getDate('today')}'`)
  else new AttendanceModel().update({ finsih: getTime(), worked_time: calculateWorkedTime(user) }, `user_id = ${user.id} AND day = '${getDate('yesterday')}'`)
  changeStatue(user)
}

/**
 * Take Attendance With Barcode by get the user data by barcode then check his statue ['online','offline']
 * if offline update user data in the users table to be online and add record to the att table
 * if online update user data in the users table to be offline and update record of the att table
 */
let barcode = async (req, res) => {
  let users = await new UserModel().get({ where: `barcode = ${req.body.barcode}` })
  if (users.length == 1)
    if (users[0].statue == 'offline')
      if (await checkIfUserAlreadyCheckedin(users[0])) res.render('redirectPage', { msg: 'user is already checked in for today!!', url: '/barcode' })
      else {
        checkIn(users[0])
        res.render('redirectPage', { msg: 'user is checked in', url: '/barcode' })
      }
    else {
      checkOut(users[0])
      res.render('redirectPage', { msg: 'user is checked out', url: '/barcode' })
    }
}

/**
 * @param {String} _day can be one of two values ['today','yesterday']
 * @returns string of the date today ex -> 2021-09-19
 */
let getDate = (_day) => {
  let date = new Date()
  if (_day == 'today') {
    let day = `${date.getFullYear()}-`
    if (date.getMonth() + 1 < 10) day += `0${date.getMonth() + 1}-`
    else day += `${date.getMonth() + 1}-`
    if (date.getDate() < 10) day += `0${date.getDate()}`
    else day += `${date.getDate()}`
    return day
  }
  else if (_day == 'yesterday') {
    date.setDate(date.getDate() - 1);
    let day = `${date.getFullYear()}-`
    if (date.getMonth() + 1 < 10) day += `0${date.getMonth() + 1}-`
    else day += `${new Date().getMonth() + 1}-`
    if (date.getDate() < 10) day += `0${date.getDate()}`
    else day += `${date.getDate()}`
    return day
  }
}

/**
 * 
 * @returns string of time now ex -> 15:30:00
 */
let getTime = () => {
  let time = ``
  if (new Date().getHours() < 10) time += `0${new Date().getHours()}:`
  else time += `${new Date().getHours()}:`
  if (new Date().getMinutes() < 10) time += `0${new Date().getMinutes()}:`
  else time += `${new Date().getMinutes()}:`
  if (new Date().getSeconds() < 10) time += `0${new Date().getSeconds()}`
  else time += `${new Date().getSeconds()}`
  return time
}

/**
 * Convert Time Stamp Like 15:30:00 To Number Format Like 15.5
 * 
 * @param {*} timeStamp take timp stame in the format ex -> 15:30:00
 * @returns number represent the time stamp to make opertaions on it ex -> 15.5
 */
let timeInNumberFormat = (timeStamp) => {
  let time = 0
  for (let i = 0; i < 5; i++) {
    if (timeStamp[i] != ":") {
      time *= 10
      switch (timeStamp[i]) {
        case "1": time += 1
          break;
        case "2": time += 2
          break;
        case "3": time += 3
          break;
        case "4": time += 4
          break;
        case "5": time += 5
          break;
        case "6": time += 6
          break;
        case "7": time += 7
          break;
        case "8": time += 8
          break;
        case "9": time += 9
          break;
      }
    }
  }
  let hour = Math.floor(time / 100)
  let minute = (Math.abs(time / 100) - hour) * (5 / 3)
  time = hour + minute
  return time
}

let calculateWorkedTime = (user) => Math.abs(timeInNumberFormat(user.startTime) - timeInNumberFormat(user.endTime))

module.exports = { barcode, barcodePage, getDate, timeInNumberFormat }