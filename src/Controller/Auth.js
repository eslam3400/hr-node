const UserModel = require('../Model/UserModel')

let loginPage = (req, res) => res.render('login', { msg: "" })

let login = async (req, res) => {
  let users = await new UserModel().get({ where: `username = '${req.body.username}' AND password = '${req.body.password}'` })
  if (users.length == 1) {
    if (users[0].role == "admin")
      return res.cookie('token', users[0].id, { maxAge: 43200000 }).redirect('/admin')
    else return res.cookie('token', users[0].id, { maxAge: 43200000 }).redirect('/employee')
  }
  else return res.render('login', { msg: "loginError" })
}

let logout = (req, res) => res.clearCookie('token').redirect('/login')

module.exports = { loginPage, login, logout }