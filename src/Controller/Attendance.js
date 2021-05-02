const Model = require('../Model/Model')

let barcodePage = (req, res) => res.render('barcode', { message: "" })

/**
 * Take Attendance With Barcode by get the user data by barcode then check his statue ['online','offline']
 * if offline update user data in the users table to be online and add record to the att table
 * if online update user data in the users table to be offline and update record of the att table
 */
let barcode = (req, res) => {
  new Model("users").get(user_data => {
    if (user_data.length == 1)
      if (user_data[0].statue == 'offline') {
        new Model("att").add({ user_id: user_data[0].id })
        new Model("users").update({ statue: 'online' }, `id = ${user_data[0].id}`)
      } else {
        new Model("att").get(att_data => {
          if (att_data.length == 1)
            new Model("att").update({
              finsih: getTime(),
              worked_time: calculateWorkedTime(timeInNumberFormat(att_data[0].start), getTime())
            }, `user_id = ${user_data[0].id} AND day = '${getDate('today')}'`)
          else if (att_data.length == 0)
            new Model("att").update({
              finsih: getTime(),
              worked_time: calculateWorkedTime(timeInNumberFormat(att_data[0].start), getTime())
            }, `user_id = ${user_data[0].id} AND day = '${getDate('yesterday')}'`)
          new Model("users").update({ statue: 'offline' }, `id = ${user_data[0].id}`)
        }, { where: `user_id = ${user_data[0].id} AND day = '${getDate('today')}'` })
      }
  }, { where: `barcode = ${req.body.barcode}` })
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

let calculateWorkedTime = (start, end) => Math.abs(start - timeInNumberFormat(end))

module.exports = { barcode, barcodePage }