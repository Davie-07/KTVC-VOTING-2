const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const env = require('../config/env');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { admissionMin, admissionMax } = require('../utils/constants');

async function studentRegister(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { firstName, lastName, course, admissionNumber, password } = req.body;
  if (admissionNumber < admissionMin || admissionNumber > admissionMax) {
    return res.status(400).json({ message: `Admission number must be between ${admissionMin} and ${admissionMax}.` });
  }
  const exists = await Student.findOne({ admissionNumber });
  if (exists) {
    return res.status(409).json({ message: 'This admission number has already been used to create an account. Please check with the system administrator.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const student = await Student.create({ firstName, lastName, course, admissionNumber, passwordHash });
  return res.status(201).json({ id: student._id });
}

async function studentLogin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { admissionNumber, password } = req.body;
  const student = await Student.findOne({ admissionNumber });
  if (!student) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, student.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: student._id, role: 'student' }, env.jwtSecret, { expiresIn: '7d' });
  return res.json({ token });
}

async function adminLogin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { systemId, password } = req.body;
  const admin = await Admin.findOne({ systemId });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, role: 'admin' }, env.jwtSecret, { expiresIn: '7d' });
  return res.json({ token });
}

module.exports = { studentRegister, studentLogin, adminLogin };

