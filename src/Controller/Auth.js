const UserModel = require('../Model/UserModel')

let loginPage = (req, res) => res.render('admin/login', { msg: "" })

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `username = '${req.body.username}' AND password = '${req.body.password}' AND role = 'admin'` })
  if (users.length == 1) return res.cookie('token', users[0].id, { maxAge: 43200000 }).redirect('/employees')
  else return res.render('admin/login', { msg: "loginError" })
}

let logout = (req, res) => res.clearCookie('token').redirect('/login')

module.exports = { loginPage, login, logout }