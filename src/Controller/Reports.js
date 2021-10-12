const AttendanceModel = require('../Model/AttendanceModel')
const ImportedReportModel = require('../Model/ImportedReportModel')
const PranchModel = require('../Model/PranchModel')
const UserModel = require('../Model/UserModel')
const LoanModel = require('../Model/LoanModel')
const Utility = require('../Utilities/Utility')
const { uploadPath } = require('../../uploadPath')
const fs = require('fs');
const att = require('../../public/report.json')

let reportsPage = async (req, res) => res.render('admin/report-options');

let report = async (req, res) => {
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  let attendance = await new AttendanceModel().get({ where: `user_id = ${req.params.id} AND day LIKE '%${req.params.year}-${req.params.month}%'` })
  res.render('admin/employee-report', { attendance, year: req.params.year, month: req.params.month, user: users[0] })
}

let printReport = async (req, res) => {
  let totalWorkedTime = 0;
  let totalBonus = 0;
  let totalDeduct = 0;
  let totalLoans = 0;
  let cash = 0;
  let users = await new UserModel().get({ where: `id = ${req.params.id}` })
  let attendance = await new AttendanceModel().get({ where: `user_id = ${req.params.id} AND day LIKE '%${req.params.year}-${req.params.month}%' ORDER BY day ASC` })
  let loans = await new LoanModel().get({ where: `employee_id= ${req.params.id} AND date LIKE '%${req.params.year}-${req.params.month}%'` })
  attendance.forEach(e => {
    totalWorkedTime += e.worked_time;
    totalBonus += e.bounes;
    totalDeduct += e.subtract;
  });
  loans.forEach(e => totalLoans += e.loan_value);
  cash = Math.floor((users[0].hourPrice * totalWorkedTime) + totalBonus - totalDeduct - totalLoans);
  res.render('admin/print-report', { attendance, user: users[0], totalWorkedTime, totalBonus, totalDeduct, totalLoans, cash })
}

let printAllReports = async (req, res) => {
  let reports = []
  let users = await new UserModel().get();
  for (let i = 0; i < users.length; i++) {
    let totalWorkedTime = 0;
    let totalBonus = 0;
    let totalDeduct = 0;
    let totalLoans = 0;
    let cash = 0;
    let attendance = await new AttendanceModel().get({ where: `user_id = ${users[i].id} AND day LIKE '%${req.params.year}-${req.params.month}%' ORDER BY day ASC` })
    if (attendance.length == 0) continue;
    let loans = await new LoanModel().get({ where: `employee_id= ${users[i].id} AND date LIKE '%${req.params.year}-${req.params.month}%'` })
    attendance.forEach(e => {
      totalWorkedTime += e.worked_time;
      totalBonus += e.bounes;
      totalDeduct += e.subtract;
    });
    loans.forEach(e => totalLoans += e.loan_value);
    cash = Math.floor((users[i].hourPrice * totalWorkedTime) + totalBonus - totalDeduct - totalLoans);
    reports.push({ attendance, user: users[i], totalWorkedTime, totalBonus, totalLoans, totalDeduct, cash })
  }
  res.render('admin/print-all-reports', { reports })
}

const importReportPage = (req, res) => res.render('admin/import-report')

const importReport = async (req, res) => {
  const test = await Utility.uploadFiles(req.files, 'report')
  var arr = [];
  fs.readFile(uploadPath + 'report.csv', function (err, data) {
    if (err) return console.log(err);
    data = data.toString();
    arr = data.split('\n');
    var jsonObj = [];
    arr[0] = arr[0].replace(/['"]+/g, '')
    var headers = arr[0].split(',');
    for (var i = 1; i < arr.length; i++) {
      arr[i] = arr[i].replace(/['"]+/g, '')
      var data = arr[i].split(',');
      var obj = {};
      for (var j = 0; j < data.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
      }
      delete obj['1']
      delete obj['name']
      delete obj['']
      delete obj['FP']
      jsonObj.push(obj);
    }
    console.log(jsonObj);
    fs.writeFileSync(uploadPath + 'report.json', JSON.stringify(jsonObj));
    res.redirect('/admin')
  });
}

module.exports = { reportsPage, report, printReport, printAllReports, importReport, importReportPage }