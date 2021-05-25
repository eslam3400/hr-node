const express = require('express')
const cookie = require('cookie-parser')
const Controller = require('./src/Controller/Controller')
const Middleware = require('./src/Middleware/Middleware')
const path = require('path')
const fileUpload = require('express-fileupload')
const app = express()
const port = 3000
/*
  Setup the view engine to the ejs
*/
app.set('view engine', 'ejs')
/*
  by default we can't access a file from the front end for security purposes
  so when we wanna get files to the front-end we need to make them static like that
*/
app.use(express.static(path.join(__dirname, 'public')))
/**
 * by using this i can access data from post reqest with the body object
 */
app.use(express.urlencoded())
/**
 * by using this i can access cookies data from cookies object
 */
app.use(cookie("DevTik"))
/**
 * by using this i can access files from files object
 */
app.use(fileUpload())

app.get('/', Controller.Dashboard.dashboard) //done
app.get('/login', Controller.Auth.loginPage) //done
app.post('/login', Controller.Auth.login) //done
app.get('/employees', Controller.Employee.employees) //done
app.get('/employee/add', Controller.Employee.addEmployeePage) //done
app.post('/employee/add', Controller.Employee.addEmployee) //done
app.get('/employee/delete/:id', Controller.Employee.deleteEmployee) //delete
app.get('/employee/loan/:id', Controller.Employee.loanPage) //done
app.post('/employee/loan/:id', Controller.Employee.loan) //done
app.get('/employee/update/:id', Controller.Employee.updatePage) //done
app.post('/employee/update/:id', Controller.Employee.update) //done
app.get('/barcode', Controller.Attendance.barcodePage)
app.post('/barcode', Controller.Attendance.barcode)
app.get('/employee/:id', Controller.Attendance.barcode)
app.get('/report/:id/:year/:month', Controller.Attendance.barcode)
app.get('*', (req, res) => res.send("404"))

app.listen(process.env.PORT || port, () => console.log(`app listening at http://localhost:${port}`))