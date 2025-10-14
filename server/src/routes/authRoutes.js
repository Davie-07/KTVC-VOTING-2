const express = require('express');
const router = express.Router();
const { studentRegister, studentLogin, adminLogin } = require('../controllers/authController');
const { studentRegisterValidation, studentLoginValidation, adminLoginValidation } = require('../utils/validators');

router.post('/student/register', studentRegisterValidation, studentRegister);
router.post('/student/login', studentLoginValidation, studentLogin);
router.post('/admin/login', adminLoginValidation, adminLogin);

module.exports = router;

