const JobModel = require('../Model/JobModel')
const PranchModel = require('../Model/PranchModel')

let dashboard = (req, res) => {
  res.render('admin/dashboard')
}

let addJobPage = (req, res) => {
  res.render('admin/add-job')
}

let addJob = (req, res) => {
  new JobModel().add(req.body)
  res.redirect('admin/add-job')
}

let addPranchPage = (req, res) => {
  res.render('admin/add-pranch')
}

let addPranch = (req, res) => {
  new PranchModel().add(req.body)
  res.redirect('admin/add-pranch')
}

module.exports = { dashboard, addJob, addJobPage, addPranch, addPranchPage }