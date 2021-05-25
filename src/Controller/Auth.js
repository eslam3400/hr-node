const Model = require('../Model/Model')

let loginPage = (req, res) => res.render('admin/login', { msg: "" })

let login = (req, res) =>
  new Model('users').get(data => {
    if (data.length > 0) res.cookie('token', data[0].id, { maxAge: 43200000 }).redirect('/')
    else res.render('admin/login', { msg: "loginError" })
  }, { where: `username = '${req.body.username}' AND password = '${req.body.password}' AND role = 'admin'` })

let logout = (req, res) => res.clearCookie('token').redirect('/')

// checkIfFieldUnique(unique => console.log(unique), { name: "username", value: "eslam34000" })

module.exports = { loginPage, login, logout }