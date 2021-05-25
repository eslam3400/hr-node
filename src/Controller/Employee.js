const UserModel = require('../Model/UserModel')
const PranchModel = require('../Model/PranchModel')
const JobModel = require('../Model/JobModel')
const LoanModel = require('../Model/LoanModel')
const AttendanceModel = require('../Model/AttendanceModel')
const { uploadFile } = require('../Utilities/Utility')
const { getDate } = require('./Attendance')

let unique = async (field = { key: null, value: null }) => {
  let users = await new UserModel().get({ where: `${field.key} = '${field.value}'` })
  return (users.length == 0) ? true : false
}

let generateBarcode = () => {
  let barcode = Math.floor(Math.random() * 10000000000000000)
  if (unique({ key: 'barcode', value: barcode })) return barcode
  else return generateBarcode()
}

let addEmployeePage = async (req, res) => {
  let pranchs = await new PranchModel().get()
  let jobs = await new JobModel().get()
  return res.render('admin/add-employee', { pranchs, jobs })
}

let addEmployee = async (req, res) => {
  if (req.body.barcode == '') generateBarcode()
  else {
    if (unique({ key: 'barcode', value: req.body.barcode })) {
      let img = await uploadFile(req.files.attachment)
      if (img) {
        req.body.img = img
        new UserModel().add(req.body)
      } else return res.render('admin/add-employee', { msg: `error uploading the attachment` })
    } else return res.render('admin/add-employee', { msg: `this barcode is already in use` })
  }
}

let employees = async (req, res) => {
  let employees = await new UserModel().get({ where: `role <> 'admin'` })
  let pranchs = await new PranchModel().get()
  let jobs = await new JobModel().get()
  return res.render('admin/employees', { employees, pranchs, jobs })
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

let report = async (req, res) => {
  let attendance = await new AttendanceModel().get({ where: `id = ${req.params.id} AND day LIKE '${req.params.year}-${req.params.month}%'` })
  res.render('employe-report', { attendance })
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
  update
}