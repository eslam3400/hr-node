const Model = require('../Model/Model')
let { uploadPath } = require('../../uploadPath')
const { v4: uuidv4 } = require('uuid');
const { getDate } = require('./Attendance')

let checkIfFieldUnique = (callBack = (unique) => { }, field = { name: null, value: null }) => new Model('users').get(data => {
  let unique = true
  let { name, value } = field
  data.forEach(user => { if (user[name] == value) unique = false });
  return callBack(unique)
})

let uploadFile = (req, res, callBack = () => { }) => {
  let userInfoFile = req.files.attachment
  let imgExtention = userInfoFile.mimetype
  imgExtention = imgExtention.slice(imgExtention.indexOf("/") + 1)
  userInfoFile.name = uuidv4() + '.' + imgExtention
  uploadPath += userInfoFile.name
  userInfoFile.mv(uploadPath, err => {
    if (err) return res.send(err)
    else {
      req.body.attachment = userInfoFile.name
      let employeeInfo = req.body
      callBack(employeeInfo)
    }
  })
}

let addEmployeePage = (req, res) => {
  new Model('pranchs').get(pranchs => {
    new Model('jobs').get(jobs =>
      res.render('admin/add-employee', { tab: "Add Employee", pranchs, jobs })
      , {})
  }, {})
}

let addEmployee = (req, res) => {
  if (req.body.role == 'admin')
    checkIfFieldUnique(unique => {
      if (unique) uploadFile(req, res, employeeInfo => {
        let barcode = Math.floor(Math.random() * 10000000000000000)
        employeeInfo.barcode = barcode
        new Model('users').add(employeeInfo)
      })
    }, { name: "username", value: req.body.username })
  else uploadFile(req, res, employeeInfo => {
    let barcode = Math.floor(Math.random() * 10000000000000000)
    employeeInfo.barcode = barcode
    new Model('users').add(employeeInfo)
  })
}

let employees = (req, res) => {
  new Model("users").get(data => {
    new Model('pranchs').get(pranchs => {
      new Model('jobs').get(jobs => res.render('admin/employees', { tab: "Employees", employees: data, pranchs, jobs }), {})
    }, {})
  }, { where: `role <> 'admin'` })
}

let deleteEmployee = (req, res) => new Model("users").delete(`id = ${req.params.id}`, () => res.redirect('/employees'))

let loanPage = (req, res) => {
  new Model("users").get(users => {
    res.render('admin/add-loan', { tab: "Employees", user: users[0] })
  }, { where: `id = ${req.params.id}` })
}

let loan = (req, res) => {
  let loanData = req.body
  loanData.employee_id = req.params.id
  loanData.date = getDate('today')
  new Model("loan").add(loanData, () => res.redirect('/employees'))
}

let updatePage = (req, res) => {
  new Model("users").get(users => {
    new Model("pranchs").get(pranchs => {
      new Model("jobs").get(jobs => {
        res.render('admin/update-employee', { tab: "Employees", user: users[0], pranchs, jobs })
      }, {})
    }, {})
  }, {
    where: `id = ${req.params.id}`
  })
}

let update = (req, res) => new Model("users").update(req.body, `id = ${req.params.id}`, () => res.redirect('/employees'))

let employee = (req, res) => new Model("users").get(data => res.render('employee', { employee: data[0] }), { where: `id = ${req.params.id}` })

let report = (req, res) => new Model("att").get(data => res.render('employe-report', { data }), { where: `id = ${req.params.id} AND day LIKE '${req.params.year}-${req.params.month}%'` })

let updateEmployeeData = (req, res) => new Model("users").update(req.body, `id = ${req.params.id}`)

module.exports = {
  addEmployeePage,
  addEmployee,
  employee,
  employees,
  report,
  updateEmployeeData,
  deleteEmployee,
  loanPage,
  loan,
  updatePage,
  update
}