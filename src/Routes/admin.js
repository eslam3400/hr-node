const router = require('express').Router()
const Controller = require('../Controller/Controller')

router.get('/', Controller.Employee.employees) //done
router.get('/employee/add', Controller.Employee.addEmployeePage) //done
router.post('/employee/add', Controller.Employee.addEmployee) //done
router.get('/employee/delete/:id', Controller.Employee.deleteEmployee) //delete
router.get('/employee/loan/:id', Controller.Employee.loanPage) //done
router.post('/employee/loan/:id', Controller.Employee.loan) //done
router.get('/employee/update/:id', Controller.Employee.updatePage) //done
router.post('/employee/update/:id', Controller.Employee.update) //done
router.get('/employee/report/:id/:year/:month', Controller.Employee.report) //done
router.get('/employee/report/:id/edit/:year/:month/:day', Controller.Employee.reportUpdatePage) //done
router.post('/employee/report/:id/edit/:year/:month/:day', Controller.Employee.reportUpdate) //done
router.get('/reports', Controller.Reports.reportsPage)
router.get('/report/:id', Controller.Employee.reportPage)
router.get('/job/add', Controller.Dashboard.addJobPage)
router.post('/job/add', Controller.Dashboard.addJob)
router.get('/pranch/add', Controller.Dashboard.addPranchPage)
router.post('/pranch/add', Controller.Dashboard.addPranch)

module.exports = router