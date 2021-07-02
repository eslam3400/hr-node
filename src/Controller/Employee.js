const UserModel = require('../Model/UserModel')
const PranchModel = require('../Model/PranchModel')
const JobModel = require('../Model/JobModel')
const LoanModel = require('../Model/LoanModel')
const AttendanceModel = require('../Model/AttendanceModel')
const { uploadFile } = require('../Utilities/Utility')
const { getDate, timeInNumberFormat } = require('./Attendance')

let unique = async (field = { key: null, value: null }) => {
  let users = await new UserModel().get({ where: `${field.key} = '${field.value}'` })
  return users.length == 0
}

let generateBarcode = () => {
  let barcode = Math.floor(Math.random() * 10000000000000000)
  if (unique({ key: 'barcode', value: barcode })) return barcode
  else return generateBarcode()
}

let validatBarcode = (barcode) => {
  if (barcode == '') return generateBarcode()
  else
    if (unique({ key: 'barcode', value: barcode })) return barcode
    else return null
}

let calculateWorkHours = (start, end) => Math.abs(timeInNumberFormat(start) - timeInNumberFormat(end))

let calculateHourPrice = (salary, workHours) => salary / (workHours * 30)

let addEmployeePage = async (req, res) => {
  let pranchs = await new PranchModel().get()
  let jobs = await new JobModel().get()
  return res.render('admin/add-employee', { pranchs, jobs })
}

let addEmployee = async (req, res) => {
  let barcode = validatBarcode(req.body.barcode)
  if (barcode == null) return res.redirect('/employees')
  req.body.barcode = barcode
  req.body.workHours = calculateWorkHours(req.body.startTime, req.body.endTime)
  req.body.hourPrice = calculateHourPrice(req.body.salary, req.body.workHours)
  let img = await uploadFile(req.files.attachment)
  if (img) { req.body.img = img } else { req.body.img = 'defualt.jpg' }
  new UserModel().add(req.body)
  return res.redirect('/employees')
}

let employees = async (req, res) => {
  let employeesData = await new UserModel().get({ where: `role <> 'admin'` })
  let pranchs = await new PranchModel().get()
  let jobs = await new JobModel().get()
  return res.render('admin/employees', { employees: employeesData, pranchs, jobs })
}

let deleteEmployee = (req, res) => {
  new UserModel().delete(`id = ${req.params.id}`)
  return res.redirect('/employees')
}

let loanPage = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  return res.render('admin/add-loan', { user: users[0] })
}

let loan = (req, res) => {
  req.body.employee_id = req.params.id
  req.body.date = getDate('today')
  new LoanModel().add(req.body)
  return res.redirect('/employees')
}

let updatePage = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  let pranchs = await new PranchModel().get()
  let jobs = await new JobModel().get()
  return res.render('admin/update-employee', { user: users[0], pranchs, jobs })
}

let update = (req, res) => {
  new UserModel().update(req.body, `id = ${req.params.id}`)
  return res.redirect('/employees')
}

let employee = async (req, res) => {
  let employeeData = await new UserModel().get({ where: `id = ${req.params.id}` })
  return res.render('employee', { employeeData })
}

let reportPage = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  res.render('admin/select-report-date', { user: users[0] })
}

let report = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  let attendance = await new AttendanceModel().get({ where: `user_id = ${req.params.id} AND day LIKE '%${req.params.year}-${req.params.month}%'` })
  res.render('admin/employee-report', { attendance, user: users[0] })
}

module.exports = {
  addEmployeePage,
  addEmployee,
  employee,
  employees,
  report,
  deleteEmployee,
  loanPage,
  loan,
  updatePage,
  update,
  reportPage
}