const { body } = require('express-validator');
const { admissionMin, admissionMax } = require('./constants');

const studentRegisterValidation = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('course').trim().notEmpty(),
  body('admissionNumber').isInt({ min: admissionMin, max: admissionMax }),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => value === req.body.password)
];

const studentLoginValidation = [
  body('admissionNumber').isInt({ min: admissionMin, max: admissionMax }),
  body('password').isLength({ min: 6 })
];

const adminLoginValidation = [
  body('systemId').trim().notEmpty(),
  body('password').isLength({ min: 6 })
];

module.exports = {
  studentRegisterValidation,
  studentLoginValidation,
  adminLoginValidation
};

