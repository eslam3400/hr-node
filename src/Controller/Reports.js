const AttendanceModel = require('../Model/AttendanceModel')
const PranchModel = require('../Model/PranchModel')

let reportsPage = async (req, res) => {
  let pranchs = await new PranchModel().get()
  return res.render('admin/report-options', { pranchs })
}

let report = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  let attendance = await new AttendanceModel().get({ where: `user_id = ${req.params.id} AND day LIKE '%${req.params.year}-${req.params.month}%'` })
  res.render('admin/employee-report', { attendance, user: users[0] })
}

module.exports = { reportsPage }