const AttendanceModel = require('../Model/AttendanceModel')

for (let i = 0; i < 31; i++) {
  let x;
  if (i < 10) x = `0${i}`;
  else x = i;
  new AttendanceModel().add({
    user_id: 8438436,
    day: `2021-05-${x}`,
    worked_time: 8
  })
}