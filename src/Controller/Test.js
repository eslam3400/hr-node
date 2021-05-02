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

console.log(getDate('yesrday'))

// var date = new Date();

// console.log(date); //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

// date.setDate(date.getDate() - 1);

// console.log(date); //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)