const router = require('express').Router();
const adminRouter = require('./admin');
const employeeRouter = require('./employee');
const Controller = require('../Controller/Controller');

router.get('/', (req, res) => res.redirect("/login"));
/**
 * Auth
 */
router.get('/login', Controller.Auth.loginPage);
router.post('/login', Controller.Auth.login);
router.get('/logout', Controller.Auth.logout);
/**
 * Attendance
 */
router.get('/barcode', Controller.Attendance.barcodePage);
router.post('/barcode', Controller.Attendance.barcode);
/**
 * Admin Dashboard
 */
router.use('/admin', adminRouter);
/**
 * Employee Dashboard
 */
router.use('/employee', employeeRouter);
/**
 * All Not Rejester Routes
 */
router.all('*', (req, res) => res.send("Page Not Founded"));

module.exports = router;