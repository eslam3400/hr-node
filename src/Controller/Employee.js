const Model = require('../Model/Model')
let { uploadPath } = require('../../uploadPath')
const { v4: uuidv4 } = require('uuid');

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
      res.render('add-employee', { tab: "Add Employee", pranchs, jobs })
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
      new Model('jobs').get(jobs => res.render('employees', { tab: "Employees", employees: data, pranchs, jobs }), {})
    }, {})
  }, { where: `role <> 'admin'` })
}

let employee = (req, res) => new Model("users").get(data => res.render('employee', { employee: data[0] }), { where: `id = ${req.params.id}` })

let report = (req, res) => new Model("att").get(data => res.render('employe-report', { data }), { where: `id = ${req.params.id} AND day LIKE '${req.params.year}-${req.params.month}%'` })

let updateEmployeeData = (req, res) => new Model("users").update(req.body, `id = ${req.params.id}`)

module.exports = { addEmployeePage, addEmployee, employee, employees, report, updateEmployeeData }